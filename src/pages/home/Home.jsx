import Features from '../../components/features/Features';
import Navbar from '../../components/navbar/Navbar';
import List from '../../components/list/List';
import './home.scss';

import {useState,useEffect} from 'react'
import api from '../../api/post'

function Home({type}) {
    const [lists,getList] = useState([]);
    const [genre ,getGenders] = useState(null);

    useEffect(() => {
            const getRandomLists = async() =>{
                try {
            const res = await api.get(`list${type ? "?type=" + type : ""}${genre ? "&genre=" + genre : ""}`,
                {
                    headers: {
                    token:
                        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjJlNmNiM2ZlZDdlM2NjNzVhMDhhZiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0NzY5Nzc5NSwiZXhwIjoxNjQ4MTI5Nzk1fQ.X6oED197Q8-BDHs_7OnHy1-WCxYqf3IdSR-StasW79I"
                }}
            );
            console.log(res)
        } catch (error) {
            console.log(error)
        }
        }
        getRandomLists();
    },[type,genre])

    return (
        <div className="home">
            <Navbar/>
            <Features type={{type}}/>
            <List />
            <List />
            <List />
        </div>
    )
}

export default Home
