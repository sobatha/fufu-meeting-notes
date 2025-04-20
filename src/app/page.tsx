import styles from "./page.module.css";
import Recorder from "@/components/recording/recorder";

export default function Home() {
  return (
    <div className={styles.page}>
      <Recorder />
    </div>
  );
}
