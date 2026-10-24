"use client"

export function getDominantColor(imageUrl: string): Promise<string> {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "Anonymous"; // Evita problemas de CORS com imagens externas
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                resolve("#ffffff");
                return;
            }

            // Reduz o tamanho do canvas para acelerar o processamento
            canvas.width = 50;
            canvas.height = 50;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            let r = 0, g = 0, b = 0, count = 0;

            // Percorre os pixels de 4 em 4 (R, G, B, Alpha)
            for (let i = 0; i < data.length; i += 4) {
                // Ignora pixels totalmente transparentes
                if (data[i + 3] < 128) continue;

                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }

            if (count === 0) {
                resolve("#ffffff");
                return;
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            resolve(`rgb(${r}, ${g}, ${b})`);
        };

        img.onerror = () => {
            resolve("#ffffff"); // Cor de fallback em caso de erro
        };
    });
}