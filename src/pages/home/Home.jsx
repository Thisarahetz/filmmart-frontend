import Features from '../../components/features/Features';
import Navbar from '../../components/navbar/Navbar';
import List from '../../components/list/List';
import './home.scss';

function Home({type}) {
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
