import type { ComponentChildren } from "preact";

import styles from "./SettingsGroup.module.css";

type SettingsGroupProps = {
  title?: ComponentChildren;
  description?: ComponentChildren;
  className?: string;
  children?: ComponentChildren;
};

export function SettingsGroup({
  title,
  description,
  className,
  children,
}: SettingsGroupProps) {
  const groupClassName = className
    ? `${styles.group} ${className}`
    : styles.group;

  return (
    <section className={groupClassName}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      {children}
    </section>
  );
}
