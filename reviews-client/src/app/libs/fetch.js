export async function fetchWithAutoRefresh(url, opts = {}) {
    const options = { credentials: 'include', ...opts };
    let res = await fetch(url, options);
    if (res.status === 401) {
        // первый 401
        const r = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });
        if (r.ok) {
            // повторяем исходный запрос уже с новым токеном
            res = await fetch(url, options);
        }
    }
    return res;
}