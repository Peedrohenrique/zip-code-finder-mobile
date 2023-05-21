export function cepMask(value) {
    return value
        .replace(/\D/g, "")
        .replace(/^(\d{5})(\d{3})+?$/, "$1-$2");
};

export function desfazMask(value) {
    if (value != null) {
        return value.replace(/[^a-z0-9]/gi, '');
    }
};