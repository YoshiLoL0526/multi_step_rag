import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useResponsive } from '../../hooks/useResponsive';

const Layout = ({ children }) => {
    const { isMobile } = useResponsive();
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const [activeTab, setActiveTab] = useState('documents');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <Header
                onToggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                isMobile={isMobile}
            />

            <div className="flex h-[calc(100vh-4rem)]">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;