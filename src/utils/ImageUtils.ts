import html2canvas from 'html2canvas';

/**
 * Exports a React component as an image.
 *
 * @param componentRef - The reference to the component's HTMLDivElement.
 * @param filePrefix - The prefix for the downloaded image file name. Defaults to 'Schedule' if not provided.
 * @param width - The desired width of the exported image.
 * @param height - The desired height of the exported image.
 * @throws Error if the componentRef is null.
 */
export async function exportComponentAsImage(
    componentRef: React.RefObject<HTMLDivElement>,
    filePrefix: string,
    width: number,
    height: number
) {
    if (componentRef.current === null) {
        throw new Error('Component ref cannot be null');
    }

    // Create an offscreen container
    const offscreenContainer = document.createElement('div');
    offscreenContainer.style.position = 'absolute';
    offscreenContainer.style.left = '-9999px'; // Place far offscreen
    document.body.appendChild(offscreenContainer);

    // Clone the component and resize
    const clonedComponent = componentRef.current.cloneNode(
        true
    ) as HTMLDivElement;
    clonedComponent.style.width = `${width}px`;
    clonedComponent.style.height = `${height}px`;
    offscreenContainer.appendChild(clonedComponent);

    try {
        const canvas = await html2canvas(clonedComponent);

        // Convert to image and download
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${filePrefix ?? 'Schedule'}.png`;
        link.click();
    } catch (err) {
        console.error('Error exporting image:', err);
    } finally {
        // Clean up
        offscreenContainer.remove();
    }
}
