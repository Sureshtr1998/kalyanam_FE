import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Sidebar } from 'primereact/sidebar';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useNavigate, useLocation } from 'react-router-dom';
import './Topbar.scss';
import { getItem, removeItem, user_login_token } from '../../utils/localStore';
import Filter from '../filter/Filter';
import type { UserDetails } from '../../utils/interfaces';

interface Props {
    userData?: UserDetails
    applyFilter?: (filterData: UserDetails) => void
}

const Topbar = (props: Props) => {
    const { userData, applyFilter } = props
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
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => navigate('/settings')
        },
        {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => {
                removeItem(user_login_token)
                navigate('/');
            }
        }
    ];

    const filterContent = (
        <div >
            <Sidebar header='Filter' className='sidebar-filter' visible={visible} onHide={() => setVisible(false)}>
                {userData && <Filter applyFilter={applyFilter} userData={userData} onHide={() => setVisible(false)} />}
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
                label={
                    getItem(user_login_token)?.username
                        ? getItem(user_login_token).username.slice(0, 2).toUpperCase()
                        : ''
                }
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
