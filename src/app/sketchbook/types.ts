import type { ReactNode } from 'react';
import type { PoseKind } from './figure';

/** Where little Nate stands on a page at progress p, and what he is doing. x is the layer's left edge in px; lift is up (negative). */
export type FigureScript = (p: number, vw: number, figW: number) => { x: number; pose?: PoseKind; lift?: number; hidden?: boolean; colored?: boolean };
export type PageProps = { progress: number; entering: number; active: boolean; boil: number; reduced: boolean; clock: number; vw: number; vh: number; seen: boolean };
/** travel: scroll in vh that plays the page (default TRAVEL_VH). */
export type PageDef = { id: string; rail?: [string, string, string]; dark?: boolean; travel?: number; script: FigureScript; render: (props: PageProps) => ReactNode };
