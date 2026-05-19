import { HeaderActions } from "./HeaderActions";
import { IconNav, type HistoryTab } from "./IconNav";
import { Logo } from "./Logo";
import styles from "./Header.module.css";

type HeaderProps = {
  activeTab: HistoryTab | null;
  onSelectTab: (tab: HistoryTab) => void;
  panelId?: string;
  navButtonRef?: React.RefObject<Record<HistoryTab, HTMLButtonElement | null>>;
};

export function Header({ activeTab, onSelectTab, panelId, navButtonRef }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.start}>
        <Logo />
      </div>
      <div className={styles.center}>
        <IconNav
          active={activeTab}
          onSelect={onSelectTab}
          panelId={panelId}
          buttonRef={navButtonRef}
        />
      </div>
      <div className={styles.end}>
        <HeaderActions />
      </div>
    </header>
  );
}
