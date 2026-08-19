import type { MDXComponents } from "mdx/types";
import { Pre } from "./CodeBlock";
import { Diagram } from "./Diagram";
import { SimpleDefinition } from "./SimpleDefinition";
import { Hinglish } from "./Hinglish";
import { RealWorld } from "./RealWorld";
import { Numbers } from "./Numbers";
import { InterviewAngle } from "./InterviewAngle";
import { Mistake } from "./Mistake";
import { QuickRevision } from "./QuickRevision";
import { Callout } from "./Callout";
import { Tradeoff } from "./Tradeoff";
import * as typography from "./typography";

/**
 * The full component map handed to next-mdx-remote's compileMDX(). Every
 * .mdx topic file gets these for free — plain HTML tags render through the
 * `typography` overrides, and the content-schema components (SimpleDefinition,
 * Hinglish, RealWorld, ...) are available with no import needed inside MDX.
 */
export const mdxComponents: MDXComponents = {
  ...typography,
  pre: Pre,
  Diagram,
  SimpleDefinition,
  Hinglish,
  RealWorld,
  Numbers,
  InterviewAngle,
  Mistake,
  QuickRevision,
  Callout,
  Tradeoff,
};
