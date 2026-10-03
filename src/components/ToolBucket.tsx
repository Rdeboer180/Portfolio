import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CARDS, coinVariants, coinVariantsReduced } from '../data/toolCoins';

export default function ToolBucket({ slug, tools }: { slug: string; tools: string[] }) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => setMounted(true), []);
  const coins = CARDS.find(card => card.slug === slug)?.coins ?? [
    { icon: 'figma-dark.svg', name: 'Figma', x: 8, rot: -10, lift: 0, z: 2 },
    { icon: 'claude.svg', name: 'Claude', x: 32, rot: 9, lift: 3, z: 3 },
    { icon: 'vscode.svg', name: 'VS Code', x: 57, rot: -6, lift: 0, z: 2 },
  ].filter(coin => tools.some(tool => coin.name === 'VS Code' ? /vs code|visual studio/i.test(tool) : tool.toLowerCase().includes(coin.name.toLowerCase())));
  return <motion.div className="tool-bucket case-playground__tray" role="img" aria-label={`Tools used: ${tools.join(', ')}`} onViewportEnter={() => setVisible(true)} onViewportLeave={() => setVisible(false)} viewport={{ amount: 0.25 }}>
    <span className="case-playground__tray-label" aria-hidden="true">[ Made With ]</span>
    {mounted && coins.map(coin => <motion.span key={coin.icon} className="case-playground__coin" style={{ left: `${coin.x}%`, bottom: 8 + coin.lift, zIndex: coin.z }} custom={coin} initial="idle" animate={visible ? 'in' : 'idle'} variants={reduced ? coinVariantsReduced : coinVariants} title={coin.name} aria-hidden="true"><img src={`/images/proficiencies/${coin.icon}`} alt="" /></motion.span>)}
  </motion.div>;
}
