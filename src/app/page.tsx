import styles from "./page.module.css";
import TestArea from "./test-area";
import { ThemeSelector } from "./theme-selector";

export default function Home() {
  return (
    <div className={styles.page}>
      <ThemeSelector>
        <main className={styles.main}>
          <TestArea />
        </main>
      </ThemeSelector>
    </div>
  );
}
