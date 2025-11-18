export function recursiveCharacterTextSplitter(
    text: string,
    chunkSize: number = 1000,
    chunkOverlap: number = 200
): string[] {
    if (!text) return [];

    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
        let endIndex = startIndex + chunkSize;

        if (endIndex < text.length) {
            // Try to find a natural break point (newline, period, space)
            // prioritizing larger structures
            const lookback = Math.min(chunkOverlap, 100); // Don't look back too far

            const lastNewline = text.lastIndexOf('\n', endIndex);
            if (lastNewline > startIndex + chunkSize - lookback) {
                endIndex = lastNewline + 1;
            } else {
                const lastPeriod = text.lastIndexOf('. ', endIndex);
                if (lastPeriod > startIndex + chunkSize - lookback) {
                    endIndex = lastPeriod + 2;
                } else {
                    const lastSpace = text.lastIndexOf(' ', endIndex);
                    if (lastSpace > startIndex + chunkSize - lookback) {
                        endIndex = lastSpace + 1;
                    }
                }
            }
        }

        const chunk = text.slice(startIndex, endIndex).trim();
        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        startIndex = endIndex - chunkOverlap;
        // Prevent infinite loops if overlap is too big or no progress
        if (startIndex >= endIndex) {
            startIndex = endIndex;
        }
    }

    return chunks;
}
