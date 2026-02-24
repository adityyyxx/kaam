export async function getUser() {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    try {
        const resp = await fetch('/api/v1/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            }
        })
        if (!resp.ok) {
            return null;
        }
        const data = await resp.json();
        return data.user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}
