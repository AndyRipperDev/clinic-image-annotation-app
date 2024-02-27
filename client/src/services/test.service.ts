export const getTestData = async () => {
    const response = await fetch("http://localhost:5095/");
    return await response.json();
}