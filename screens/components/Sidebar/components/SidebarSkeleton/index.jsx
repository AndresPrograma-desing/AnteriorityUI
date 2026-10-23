import React from 'react';
import Skeleton from '../../../Skeleton/index';
import sidebarStyles from '../../index.module.css';
import itemStyles from '../SidebarItem/index.module.css';

function SidebarSkeleton({ skeletonItems, effectiveCollapsed }) {
  return (
    <div className={sidebarStyles.menuGroup}>
      <div className={sidebarStyles.buttonList}>
        {Array.from({ length: skeletonItems }).map((_, idx) => (
          <div key={`skeleton-${idx}`} className={itemStyles.sidebarItemBtn} style={{ cursor: 'default' }}>
            <div className={itemStyles.btnLayout}>
              <div className={itemStyles.leftPart}>
                <Skeleton circle width={20} height={20} />
                {!effectiveCollapsed && <Skeleton width={`${55 + (idx % 3) * 15}%`} height="12px" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SidebarSkeleton;
