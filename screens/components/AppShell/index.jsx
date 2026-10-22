import React, { useState } from 'react';
import ProSidebar from '../Sidebar/index';
import TopBar from '../TopBar/index';
import ScrollBar from '../ScrollBar/index';
import Container from '../Container/index';
import styles from './index.module.css';

const AppShell = ({
  sidebarProps = {},
  topBarProps = {},
  children,
  contentBgColor,
  useContainer = false,
  containerProps = {},
  className = '',
  style,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const content = useContainer
    ? <Container wattermark={false} {...containerProps}>{children}</Container>
    : children;

  return (
    <div className={`${styles.shell} ${className}`} style={style}>
      <ProSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        {...sidebarProps}
      />

      <div className={styles.main}>
        <TopBar
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          {...topBarProps}
        />

        <div
          className={styles.content}
          style={contentBgColor ? { '--app-shell-content-bg': contentBgColor } : undefined}
        >
          <ScrollBar horizontal={false} className={styles.scrollBar}>
            {content}
          </ScrollBar>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
