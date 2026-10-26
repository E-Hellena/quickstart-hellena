function hexToRgb(hex: string) {
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(cleanHex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}

// Mapeamento de cores base para os seus respetivos valores HEX de referência
const baseColorHexMap: Record<string, string> = {
    Red: "#FF0000",
    Blue: "#0000FF",
    Green: "#008000",
    Black: "#000000",
    White: "#FFFFFF",
    Grey: "#808080",
    Beige: "#F5F5DC",
};

// Compara se o HEX do produto está próximo da cor selecionada (tolerância ajustável)
function isColorClose(productHex: string, selectedColorName: string, tolerance = 90): boolean {
    if (!productHex.startsWith("#")) return productHex.toLowerCase().includes(selectedColorName.toLowerCase());

    const refHex = baseColorHexMap[selectedColorName];
    if (!refHex) return false;

    const rgb1 = hexToRgb(productHex);
    const rgb2 = hexToRgb(refHex);

    // Distância Euclidiana entre as duas cores no espaço RGB
    const distance = Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );

    // Quanto menor a distância, mais parecida é a cor. 90 é uma tolerância excelente para tons da mesma família.
    return distance <= tolerance;
}

// Validador de cores do produto para os filtros selecionados
export function matchesHexColorFamily(productColors: string[] | null | undefined, selectedColors: string[]): boolean {
    if (!productColors || productColors.length === 0) return false;
    if (selectedColors.length === 0) return true;

    return productColors.some((prodColor) => {
        // Proteção extra caso algum item do array seja nulo/indefinido
        if (!prodColor) return false;

        return selectedColors.some((selColor) => {
            if (prodColor.startsWith("#")) {
                return isColorClose(prodColor, selColor);
            }
            return prodColor.toLowerCase().includes(selColor.toLowerCase());
        });
    });
}