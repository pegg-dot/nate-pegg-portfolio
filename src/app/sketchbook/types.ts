import type { ReactNode } from 'react';
import type { PoseKind } from './figure';

/** Where little Nate stands on a page at progress p, and what he is doing. x is the layer's left edge in px. */
export type FigureScript = (p: number, vw: number, figW: number) => { x: number; pose?: PoseKind; lift?: number; hidden?: boolean; colored?: boolean };
export type PageProps = { progress: number; active: boolean; boil: number; reduced: boolean; clock: number; vw: number; seen: boolean };
export type PageDef = { id: string; rail?: [string, string, string]; dark?: boolean; height?: string; script: FigureScript; render: (props: PageProps) => ReactNode };
