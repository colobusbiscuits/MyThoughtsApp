import { useMemo, useRef, useState } from 'react';
import {
    Alert,
    Image,
    PanResponder,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Directory, File, Paths } from 'expo-file-system';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Category } from './types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EditCategory'> & {
    categories: Category[];
    addCategory: (name: string, color: string, image?: string) => void;
    updateCategory: (categoryId: string, name: string, color: string, image?: string) => void;
};

const DEFAULT_COLOR = '#7C9CFF';
const PHOTOS_DIR = new Directory(Paths.document, 'category-photos');

export default function EditCategoryScreen({ navigation, route, categories, addCategory, updateCategory }: Props) {
    const { categoryId } = route.params;
    const existing = categoryId ? categories.find((c) => c.id === categoryId) : undefined;
    const [name, setName] = useState(existing?.name ?? '');
    const [color, setColor] = useState(existing?.color ?? DEFAULT_COLOR);
    const [image, setImage] = useState<string | undefined>(existing?.image);
    const canSave = name.trim().length > 0;

    const handlePickPhoto = async () => {
        const uri = await pickCategoryPhoto();
        if (uri) setImage(uri);
    }

   const save = () => {
        if (!canSave) return;
        if (existing) {
            updateCategory(existing.id, name.trim(), color, image);
        } else {
            addCategory(name.trim(), color, image);
        }
        navigation.goBack();
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Category name"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                autoFocus
            />

            <Text style={styles.label}>Color</Text>
            <ColorPicker value={color} onChange={setColor} />

            <Text style={styles.label}>Photo (optional)</Text>
            {image ? (
                <View style={styles.photoRow}>
                    <Image source={{ uri: image }} style={styles.photoPreview} />
                    <Pressable
                        onPress={() => setImage(undefined)}
                        style={({ pressed }) => [styles.removePhotoButton, pressed && styles.saveButtonPressed]}
                        >
                            <Text style = {styles.removePhotoText}>Remove Photo</Text>
                        </Pressable>
                </View>
            ) : (
                <Pressable
                onPress={handlePickPhoto}
                style={({ pressed }) => [styles.choosePhotoButton, pressed && styles.saveButtonPressed]}
                >
                    <Text style={styles.choosePhotoText}>Choose Photo</Text>
                </Pressable>
            )}

            <Pressable
                style={({ pressed }) => [
                    styles.saveButton,
                    !canSave && styles.saveButtonDisabled,
                    pressed && canSave && styles.saveButtonPressed,
                ]}
                onPress={save}
                disabled={!canSave}
            >
                <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
                    {existing ? 'Save Changes' : 'Add Category'}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

async function pickCategoryPhoto(): Promise<string | null> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
        Alert.alert('Permission needed', 'Allow photo library access to set a cateogry photo.')
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return null;

    if (!PHOTOS_DIR.exists) {
        PHOTOS_DIR.create({ intermediates: true});
    }

    const sourceFile = new File(result.assets[0].uri);
    const destFile = new File(PHOTOS_DIR, `${Date.now()}.jpg`);
    sourceFile.copy(destFile);

    return destFile.uri;
}

// ---------- Color picker ----------
// Built entirely from core react-native (View + PanResponder) so it needs no
// extra packages — gradients are approximated with a row/column of thin,
// individually-colored bars rather than a native gradient view.

const PICKER_SIZE = 220;
const HUE_HEIGHT = 28;
const THUMB = 22;
const GRADIENT_STEPS = 36;

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
    const hue = ((h % 360) + 360) % 360;
    const c = v * s;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hue < 60) [r, g, b] = [c, x, 0];
    else if (hue < 120) [r, g, b] = [x, c, 0];
    else if (hue < 180) [r, g, b] = [0, c, x];
    else if (hue < 240) [r, g, b] = [0, x, c];
    else if (hue < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hsvToHex(h: number, s: number, v: number): string {
    return rgbToHex(...hsvToRgb(h, s, v));
}

function hexToRgb(hex: string): [number, number, number] | null {
    const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    if (!match) return null;
    const int = parseInt(match[1], 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
    const rf = r / 255;
    const gf = g / 255;
    const bf = b / 255;
    const max = Math.max(rf, gf, bf);
    const min = Math.min(rf, gf, bf);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
        if (max === rf) h = ((gf - bf) / d) % 6;
        else if (max === gf) h = (bf - rf) / d + 2;
        else h = (rf - gf) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
    }
    const s = max === 0 ? 0 : d / max;
    return [h, s, max];
}

function hexToHsv(hex: string): [number, number, number] | null {
    const rgb = hexToRgb(hex);
    return rgb ? rgbToHsv(...rgb) : null;
}

function isValidHex(hex: string): boolean {
    return /^#?[0-9a-f]{6}$/i.test(hex.trim());
}

function ColorPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
    const initial = hexToHsv(value) ?? [0, 1, 1];
    const [hue, setHue] = useState(initial[0]);
    const [sat, setSat] = useState(initial[1]);
    const [val, setVal] = useState(initial[2]);
    const [hexInput, setHexInput] = useState(value.toUpperCase());
    const lastEmitted = useRef(value.toUpperCase());

    const hex = hsvToHex(hue, sat, val);
    const hueHex = hsvToHex(hue, 1, 1);

    const emit = (h: number, s: number, v: number) => {
        const next = hsvToHex(h, s, v);
        lastEmitted.current = next;
        setHexInput(next);
        onChange(next);
    };

    // Saturation/value square.
    // We deliberately avoid View.measure() here — its result is a page
    // coordinate snapshot taken once at layout time, and goes stale (causing
    // the thumb to land far from your finger) if the screen shifts at all
    // afterwards: a still-settling nav transition, the ScrollView adjusting
    // for the keyboard, etc. Instead we read the touch's position relative
    // to the square directly from the native event at gesture start, then
    // track it purely via the gesture's accumulated dx/dy — both are
    // independent of where the view actually sits on screen.
    const squareOrigin = useRef({ x: 0, y: 0 });
    const touchSquare = (x: number, y: number) => {
        const clampedX = clamp(x, 0, PICKER_SIZE);
        const clampedY = clamp(y, 0, PICKER_SIZE);
        const s = clampedX / PICKER_SIZE;
        const v = 1 - clampedY / PICKER_SIZE;
        setSat(s);
        setVal(v);
        emit(hue, s, v);
    };
    const squareResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                squareOrigin.current = { x: locationX, y: locationY };
                touchSquare(locationX, locationY);
            },
            onPanResponderMove: (_evt, gesture) => {
                touchSquare(
                    squareOrigin.current.x + gesture.dx,
                    squareOrigin.current.y + gesture.dy
                );
            },
        })
    ).current;

    // Hue slider — same relative-delta approach as the square above.
    const hueOrigin = useRef({ x: 0 });
    const touchHue = (x: number) => {
        const clampedX = clamp(x, 0, PICKER_SIZE);
        const h = (clampedX / PICKER_SIZE) * 360;
        setHue(h);
        emit(h, sat, val);
    };
    const hueResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { locationX } = evt.nativeEvent;
                hueOrigin.current = { x: locationX };
                touchHue(locationX);
            },
            onPanResponderMove: (_evt, gesture) => {
                touchHue(hueOrigin.current.x + gesture.dx);
            },
        })
    ).current;

    const satBars = useMemo(
        () =>
            Array.from({ length: GRADIENT_STEPS }, (_, i) => {
                const t = i / (GRADIENT_STEPS - 1);
                return hsvToHex(hue, t, 1);
            }),
        [hue]
    );

    const shadeBars = useMemo(
        () => Array.from({ length: GRADIENT_STEPS }, (_, i) => i / (GRADIENT_STEPS - 1)),
        []
    );

    const hueBars = useMemo(
        () => Array.from({ length: GRADIENT_STEPS }, (_, i) => hsvToHex((i / (GRADIENT_STEPS - 1)) * 360, 1, 1)),
        []
    );

    const handleHexChange = (text: string) => {
        const normalized = (text.startsWith('#') ? text : `#${text}`).toUpperCase();
        setHexInput(normalized);
        if (isValidHex(normalized)) {
            const hsv = hexToHsv(normalized);
            if (hsv) {
                setHue(hsv[0]);
                setSat(hsv[1]);
                setVal(hsv[2]);
                lastEmitted.current = normalized;
                onChange(normalized);
            }
        }
    };

    return (
        <View style={pickerStyles.container}>
            <View style={pickerStyles.square} {...squareResponder.panHandlers}>
                <View style={[StyleSheet.absoluteFill, pickerStyles.rowFill]}>
                    {satBars.map((c, i) => (
                        <View key={i} style={{ flex: 1, backgroundColor: c }} />
                    ))}
                </View>
                <View style={StyleSheet.absoluteFill}>
                    {shadeBars.map((alpha, i) => (
                        <View key={i} style={{ flex: 1, backgroundColor: `rgba(0,0,0,${alpha})` }} />
                    ))}
                </View>
                <View
                    pointerEvents="none"
                    style={[
                        pickerStyles.thumb,
                        {
                            left: sat * PICKER_SIZE - THUMB / 2,
                            top: (1 - val) * PICKER_SIZE - THUMB / 2,
                            backgroundColor: hex,
                        },
                    ]}
                />
            </View>

            <View style={pickerStyles.hueTrack} {...hueResponder.panHandlers}>
                <View style={[StyleSheet.absoluteFill, pickerStyles.rowFill]}>
                    {hueBars.map((c, i) => (
                        <View key={i} style={{ flex: 1, backgroundColor: c }} />
                    ))}
                </View>
                <View
                    pointerEvents="none"
                    style={[
                        pickerStyles.hueThumb,
                        { left: (hue / 360) * PICKER_SIZE - THUMB / 2, backgroundColor: hueHex },
                    ]}
                />
            </View>

            <View style={pickerStyles.hexRow}>
                <View style={[pickerStyles.preview, { backgroundColor: hex }]} />
                <TextInput
                    value={hexInput}
                    onChangeText={handleHexChange}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={7}
                    placeholder="#RRGGBB"
                    placeholderTextColor={colors.textMuted}
                    style={pickerStyles.hexInput}
                />
            </View>
        </View>
    );
}

const pickerStyles = StyleSheet.create({
    container: { alignItems: 'center', marginTop: 4 },
    rowFill: { flexDirection: 'row' },
    square: {
        width: PICKER_SIZE,
        height: PICKER_SIZE,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    thumb: {
        position: 'absolute',
        width: THUMB,
        height: THUMB,
        borderRadius: THUMB / 2,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    hueTrack: {
        width: PICKER_SIZE,
        height: HUE_HEIGHT,
        borderRadius: HUE_HEIGHT / 2,
        overflow: 'hidden',
        marginTop: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    hueThumb: {
        position: 'absolute',
        top: (HUE_HEIGHT - THUMB) / 2,
        width: THUMB,
        height: THUMB,
        borderRadius: THUMB / 2,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    hexRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, width: PICKER_SIZE },
    preview: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginRight: 10 },
    hexInput: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.text,
        paddingHorizontal: 12,
        height: 40,
        fontSize: 15,
    },
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 40, flexGrow: 1 },
    input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 16, color: colors.text },
    label: { color: colors.textMuted, fontSize: 13, fontWeight: '600', marginTop: 20, marginBottom: 10 },
    photoRow: { flexDirection: 'row', alignItems: 'center'},
    photoPreview: { width: 64, height: 64, borderRadius: 10, marginRight: 12, borderWidth: 1, borderColor: colors.border},
    choosePhotoButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
    choosePhotoText: { color: colors.text, fontWeight: '600', fontSize: 15 },
    removePhotoButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14 },
    removePhotoText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
    saveButton: { marginTop: 24, backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    saveButtonDisabled: { backgroundColor: colors.surface },
    saveButtonPressed: { backgroundColor: colors.accentPressed },
    saveButtonText: { color: colors.text, fontWeight: '600', fontSize: 16 },
    saveButtonTextDisabled: { color: colors.textMuted },
});
