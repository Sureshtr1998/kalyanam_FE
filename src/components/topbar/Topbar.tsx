import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Sidebar } from 'primereact/sidebar';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { user_login_token } from '../../utils/constants';
import './Topbar.scss';

const Topbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const menu = useRef<Menu>(null);
    const [visible, setVisible] = useState(false);

    const avatarMenuItems = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => navigate('/profile')
        },
        {
            label: 'Invitation Status',
            icon: 'pi pi-table',
            command: () => navigate('/invitations')
        },
        {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => {
                localStorage.removeItem(user_login_token);
                navigate('/');
            }
        }
    ];

    const filterContent = (
        <div >
            <Sidebar className='sidebar-filter' visible={visible} onHide={() => setVisible(false)}>
                <h2>Filter</h2>
                <p>Filter Details</p>
            </Sidebar>
            <Button className='left-btn' icon="pi pi-filter" onClick={() => setVisible(true)} />
        </div>
    );
    const homeContent = (
        <div>
            <Button
                className='left-btn'
                icon="pi pi-home"
                tooltipOptions={{ position: 'bottom' }}
                onClick={() => navigate('/home')}
            />
        </div>
    );

    const endContent = (
        <div className="topbar-avatar">
            <Menu model={avatarMenuItems} popup ref={menu} />
            <Avatar
                label="S"
                shape="circle"
                size="normal"
                style={{ cursor: 'pointer' }}
                className='avatar-icon'
                onClick={(e) => menu.current?.toggle(e)}
            />
        </div>
    );

    return <Toolbar className="app-topbar" start={location.pathname === '/home' ? filterContent : homeContent} end={endContent} />;
};

export default Topbar;
