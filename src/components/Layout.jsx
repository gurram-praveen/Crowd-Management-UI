import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, title, alerts = [] }) => {
  console.log('Header alerts length:', alerts.length);
    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Header title={title} alerts={alerts} />
                <div className="content-area">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
