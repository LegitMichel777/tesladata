import axios from 'axios'

export default async function httpCall(url) {
    let res=await axios.get(url)
    return res.data;
}