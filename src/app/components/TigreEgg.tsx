"use client";

import { useState } from "react";

export default function TigreEgg() {
  const [open, setOpen] = useState(false);
  return (
    <button className={`tigreEgg ${open ? "open" : ""}`} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
      <span aria-hidden="true">◌</span>
      {open ? "Tigre. It was a giraffe blanket. I called it tiger anyway." : "tigre?"}
    </button>
  );
}
