import axios from 'axios';
const useGetMessageByConversationId = async (conversationId: number) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const response = await axios.get(`${API_URL}/conversations/${conversationId}`, options);
        return response.data.data;
    } catch (error) {
        throw error
    }

};
export default useGetMessageByConversationId