import React from 'react';
import { Project } from '../data/projects';
import LoopVideo from './LoopVideo';

/** Reuse the exact homepage cover without adding player chrome. */
export default function ProjectPreview({ project }: { project: Project }) {
  if (!project.featuredVideo) return null;
  return <figure className="project-overview__preview">
    <LoopVideo src={project.featuredVideo} poster={project.featuredVideo.replace(/\.mp4$/, '-poster.jpg')} label={`${project.title} preview`} />
  </figure>;
}
