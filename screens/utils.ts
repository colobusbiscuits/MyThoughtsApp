export function singularize(name: string): string {
    return name.replace(/s$/i, '');
}