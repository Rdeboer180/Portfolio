import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

/** Shareable reading link; the shared route handler supplies panel navigation. */
export default function ProjectLink(props: LinkProps) {
  return <Link {...props} />;
}
