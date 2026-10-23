import React, { useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavDropdown } from './components/index.js';
import styles from './index.module.css';

function NavLinks({ navLinks, navLinkColor, navLinkActiveColor }) {
    const [openIndex, setOpenIndex] = useState(null);
    const [panelTop, setPanelTop] = useState(null);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        if (openIndex === null || !containerRef.current) return;
        const header = containerRef.current.closest('header');
        if (!header) return;
        setPanelTop(header.getBoundingClientRect().bottom);
    }, [openIndex]);

    if (!navLinks || navLinks.length === 0) return null;

    const closeDropdown = () => setOpenIndex(null);

    const navLinkStyle = {
        ...(navLinkColor ? { '--topbar-navlink-color': navLinkColor } : {}),
        ...(navLinkActiveColor ? { '--topbar-navlink-active': navLinkActiveColor } : {}),
    };

    return (
        <nav ref={containerRef} className={styles.navLinks} style={navLinkStyle}>
            {navLinks.map((link, index) => {
                const hasDropdown = Boolean(link.dropdownContent);
                const isOpen = openIndex === index;

                const handleClick = (event) => {
                    if (hasDropdown) {
                        event.preventDefault();
                        setOpenIndex(isOpen ? null : index);
                        return;
                    }
                    link.onClick && link.onClick(link);
                };

                const LinkTag = !hasDropdown && link.href ? 'a' : 'button';
                const linkProps = LinkTag === 'a'
                    ? { href: link.href }
                    : { type: 'button' };

                return (
                    <div key={link.id ?? link.label} className={styles.navLinkWrapper}>
                        <LinkTag
                            {...linkProps}
                            className={`${styles.navLink} ${isOpen ? styles.navLinkOpen : ''}`}
                            onClick={handleClick}
                        >
                            {link.label}
                            {hasDropdown && (
                                <ChevronDown
                                    size={14}
                                    className={`${styles.navLinkChevron} ${isOpen ? styles.navLinkChevronOpen : ''}`}
                                />
                            )}
                        </LinkTag>

                        {hasDropdown && (
                            <NavDropdown
                                open={isOpen}
                                top={panelTop}
                                onClose={closeDropdown}
                                bgColor={link.dropdownBgColor}
                                textColor={link.dropdownTextColor}
                                borderColor={link.dropdownBorderColor}
                            >
                                {link.dropdownContent}
                            </NavDropdown>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

export default NavLinks;
