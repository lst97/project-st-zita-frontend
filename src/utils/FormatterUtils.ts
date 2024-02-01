export type UrlParams = { [key: string]: string | number };
/**
 * Replaces placeholders in a URL template with actual values from a params object.
 *
 * @param {string} template - The URL template string.
 * @param {UrlParams} params - An object containing the placeholder values.
 * @return {string} - The formatted URL string.
 */
export const formatUrl = (template: string, params: UrlParams): string => {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        if (params.hasOwnProperty(key)) {
            return encodeURIComponent(params[key]);
        }
        return match;
    });
};
