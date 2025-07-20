export const createURL = (frame: number, url: string) => {
    const id = (frame + 1).toString().padStart(2, '0');
    return new URL(`${url}${id}.png`, import.meta.url).href;
}