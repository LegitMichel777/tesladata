import axios from 'axios';

export default async function httpCall(url) {
    const res = await axios.get(url);
    return res.data;
}
