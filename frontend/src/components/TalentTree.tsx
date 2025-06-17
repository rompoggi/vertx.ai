import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillNode {
  id: string;
  name: string;
  icon?: string;
  level: number;
  prerequisites?: string[];
  children?: SkillNode[];
  description?: string;
  position?: { x: number; y: number };
}

interface Subject {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
  icon: string;
  skillTree: SkillNode[];
}

const TalentTree: React.FC = () => {
  const [activatedNodes, setActivatedNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>('maths');

  const subjects: Subject[] = [
    {
      id: 'maths',
      name: 'Mathematics',
      color: '#3B82F6',
      secondaryColor: '#1D4ED8',
      icon: '∑',
      skillTree: [
        // Level 1 - Base
        {
          id: 'math_base',
          name: 'Fundamentals',
          icon: '🔢',
          level: 1,
          position: { x: 0, y: -280 },
          children: [
            {
              id: 'arithmetique',
              name: 'Arithmetic',
              icon: '+',
              level: 2,
              position: { x: -160, y: -140 },
              children: [
                {
                  id: 'addition',
                  name: 'Addition',
                  icon: '➕',
                  level: 3,
                  position: { x: -240, y: 0 }
                },
                {
                  id: 'multiplication',
                  name: 'Multiplication',
                  icon: '✖️',
                  level: 3,
                  position: { x: -80, y: 0 },
                  children: [
                    {
                      id: 'tables_mult',
                      name: 'Multiplication tables',
                      icon: '📊',
                      level: 4,
                      position: { x: -80, y: 140 }
                    }
                  ]
                }
              ]
            },
            {
              id: 'algebre',
              name: 'Algebra',
              icon: 'x',
              level: 2,
              prerequisites: ['arithmetique'],
              position: { x: 160, y: -140 },
              children: [
                {
                  id: 'equations_lineaires',
                  name: 'Linear equations',
                  icon: '📈',
                  level: 3,
                  position: { x: 80, y: 0 },
                  children: [
                    {
                      id: 'systemes_equations',
                      name: 'Systems of equations',
                      icon: '🔗',
                      level: 4,
                      position: { x: 80, y: 140 }
                    }
                  ]
                },
                {
                  id: 'polynomes',
                  name: 'Polynomials',
                  icon: '📝',
                  level: 3,
                  prerequisites: ['equations_lineaires'],
                  position: { x: 240, y: 0 },
                  children: [
                    {
                      id: 'factorisation',
                      name: 'Factorization',
                      icon: '🧩',
                      level: 4,
                      position: { x: 240, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Geometry branch
        {
          id: 'geometrie',
          name: 'Geometry',
          icon: '△',
          level: 1,
          position: { x: -280, y: -280 },
          children: [
            {
              id: 'geometrie_plane',
              name: 'Plane geometry',
              icon: '📐',
              level: 2,
              position: { x: -360, y: -140 },
              children: [
                {
                  id: 'triangles',
                  name: 'Triangles',
                  icon: '🔺',
                  level: 3,
                  position: { x: -440, y: 0 },
                  children: [
                    {
                      id: 'theoreme_pythagore',
                      name: 'Pythagorean theorem',
                      icon: '📏',
                      level: 4,
                      position: { x: -440, y: 140 }
                    }
                  ]
                },
                {
                  id: 'cercles',
                  name: 'Circles',
                  icon: '⭕',
                  level: 3,
                  position: { x: -280, y: 0 },
                  children: [
                    {
                      id: 'circonference',
                      name: 'Circumference',
                      icon: '🔄',
                      level: 4,
                      position: { x: -280, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Analysis branch
        {
          id: 'analyse',
          name: 'Analysis',
          icon: '∫',
          level: 1,
          prerequisites: ['algebre'],
          position: { x: 280, y: -280 },
          children: [
            {
              id: 'fonctions',
              name: 'Functions',
              icon: '📊',
              level: 2,
              position: { x: 360, y: -140 },
              children: [
                {
                  id: 'derivees',
                  name: 'Derivatives',
                  icon: '📈',
                  level: 3,
                  position: { x: 280, y: 0 },
                  children: [
                    {
                      id: 'regles_derivation',
                      name: 'Derivation rules',
                      icon: '⚡',
                      level: 4,
                      position: { x: 280, y: 140 }
                    }
                  ]
                },
                {
                  id: 'integrales',
                  name: 'Integrals',
                  icon: '∫',
                  level: 3,
                  prerequisites: ['derivees'],
                  position: { x: 440, y: 0 },
                  children: [
                    {
                      id: 'integration_parties',
                      name: 'Integration by parts',
                      icon: '🔧',
                      level: 4,
                      position: { x: 440, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'physique',
      name: 'Physics',
      color: '#EF4444',
      secondaryColor: '#DC2626',
      icon: '⚛',
      skillTree: [
        {
          id: 'mecanique_classique',
          name: 'Classical mechanics',
          icon: '⚙',
          level: 1,
          position: { x: 0, y: -280 },
          children: [
            {
              id: 'cinematique',
              name: 'Kinematics',
              icon: '🏃',
              level: 2,
              position: { x: -160, y: -140 },
              children: [
                {
                  id: 'mouvement_rectiligne',
                  name: 'Rectilinear motion',
                  icon: '➡️',
                  level: 3,
                  position: { x: -240, y: 0 },
                  children: [
                    {
                      id: 'vitesse_acceleration',
                      name: 'Velocity and acceleration',
                      icon: '🚀',
                      level: 4,
                      position: { x: -240, y: 140 }
                    }
                  ]
                }
              ]
            },
            {
              id: 'dynamique',
              name: 'Dynamics',
              icon: '💥',
              level: 2,
              prerequisites: ['cinematique'],
              position: { x: 160, y: -140 },
              children: [
                {
                  id: 'lois_newton',
                  name: 'Newton\'s laws',
                  icon: '🍎',
                  level: 3,
                  position: { x: 160, y: 0 },
                  children: [
                    {
                      id: 'force_gravitation',
                      name: 'Gravitational force',
                      icon: '🌍',
                      level: 4,
                      position: { x: 160, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Thermodynamics branch
        {
          id: 'thermodynamique',
          name: 'Thermodynamics',
          icon: '🌡️',
          level: 1,
          position: { x: -280, y: -280 },
          children: [
            {
              id: 'temperature_chaleur',
              name: 'Temperature and heat',
              icon: '🔥',
              level: 2,
              position: { x: -360, y: -140 },
              children: [
                {
                  id: 'dilatation_thermique',
                  name: 'Thermal expansion',
                  icon: '📏',
                  level: 3,
                  position: { x: -440, y: 0 },
                  children: [
                    {
                      id: 'gaz_parfaits',
                      name: 'Ideal gases',
                      icon: '💨',
                      level: 4,
                      position: { x: -440, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Electricity branch
        {
          id: 'electricite',
          name: 'Electricity',
          icon: '⚡',
          level: 1,
          position: { x: 280, y: -280 },
          children: [
            {
              id: 'courant_electrique',
              name: 'Electric current',
              icon: '🔌',
              level: 2,
              position: { x: 360, y: -140 },
              children: [
                {
                  id: 'loi_ohm',
                  name: 'Ohm\'s law',
                  icon: 'Ω',
                  level: 3,
                  position: { x: 280, y: 0 },
                  children: [
                    {
                      id: 'circuits_electriques',
                      name: 'Electrical circuits',
                      icon: '🔗',
                      level: 4,
                      position: { x: 280, y: 140 }
                    }
                  ]
                },
                {
                  id: 'magnetisme',
                  name: 'Magnetism',
                  icon: '🧲',
                  level: 3,
                  position: { x: 440, y: 0 },
                  children: [
                    {
                      id: 'champ_magnetique',
                      name: 'Magnetic field',
                      icon: '⭕',
                      level: 4,
                      position: { x: 440, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'informatique',
      name: 'Computer Science',
      color: '#10B981',
      secondaryColor: '#059669',
      icon: '💻',
      skillTree: [
        {
          id: 'programmation_base',
          name: 'Basic programming',
          icon: '</>', 
          level: 1,
          position: { x: 0, y: -280 },
          children: [
            {
              id: 'variables',
              name: 'Variables',
              icon: '📦',
              level: 2,
              position: { x: -160, y: -140 },
              children: [
                {
                  id: 'types_donnees',
                  name: 'Data types',
                  icon: '🏷️',
                  level: 3,
                  position: { x: -240, y: 0 },
                  children: [
                    {
                      id: 'entiers_decimaux',
                      name: 'Integers and decimals',
                      icon: '🔢',
                      level: 4,
                      position: { x: -240, y: 140 }
                    }
                  ]
                }
              ]
            },
            {
              id: 'structures_controle',
              name: 'Control structures',
              icon: '🔀',
              level: 2,
              prerequisites: ['variables'],
              position: { x: 160, y: -140 },
              children: [
                {
                  id: 'conditions',
                  name: 'Conditions',
                  icon: '❓',
                  level: 3,
                  position: { x: 80, y: 0 },
                  children: [
                    {
                      id: 'if_else',
                      name: 'If/Else',
                      icon: '⚡',
                      level: 4,
                      position: { x: 80, y: 140 }
                    }
                  ]
                },
                {
                  id: 'boucles',
                  name: 'Loops',
                  icon: '🔄',
                  level: 3,
                  position: { x: 240, y: 0 },
                  children: [
                    {
                      id: 'for_while',
                      name: 'For/While',
                      icon: '⭕',
                      level: 4,
                      position: { x: 240, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Algorithms branch
        {
          id: 'algorithmes',
          name: 'Algorithms',
          icon: '🧮',
          level: 1,
          position: { x: -280, y: -280 },
          children: [
            {
              id: 'tri_recherche',
              name: 'Sorting and searching',
              icon: '🔍',
              level: 2,
              position: { x: -360, y: -140 },
              children: [
                {
                  id: 'tri_bulle',
                  name: 'Bubble sort',
                  icon: '🫧',
                  level: 3,
                  position: { x: -440, y: 0 },
                  children: [
                    {
                      id: 'complexite_algo',
                      name: 'Algorithmic complexity',
                      icon: '📊',
                      level: 4,
                      position: { x: -440, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Data structures branch
        {
          id: 'structures_donnees',
          name: 'Data structures',
          icon: '🗂️',
          level: 1,
          position: { x: 280, y: -280 },
          children: [
            {
              id: 'tableaux_listes',
              name: 'Arrays and lists',
              icon: '📋',
              level: 2,
              position: { x: 360, y: -140 },
              children: [
                {
                  id: 'tableaux_dynamiques',
                  name: 'Dynamic arrays',
                  icon: '📈',
                  level: 3,
                  position: { x: 280, y: 0 },
                  children: [
                    {
                      id: 'listes_chainees',
                      name: 'Linked lists',
                      icon: '🔗',
                      level: 4,
                      position: { x: 280, y: 140 }
                    }
                  ]
                },
                {
                  id: 'piles_files',
                  name: 'Stacks and queues',
                  icon: '📚',
                  level: 3,
                  position: { x: 440, y: 0 },
                  children: [
                    {
                      id: 'arbres_binaires',
                      name: 'Binary trees',
                      icon: '🌳',
                      level: 4,
                      position: { x: 440, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'chimie',
      name: 'Chemistry',
      color: '#8B5CF6',
      secondaryColor: '#7C3AED',
      icon: '🧪',
      skillTree: [
        {
          id: 'chimie_generale',
          name: 'General chemistry',
          icon: '⚗️',
          level: 1,
          position: { x: 0, y: -280 },
          children: [
            {
              id: 'atomes_molecules',
              name: 'Atoms and molecules',
              icon: '⚛️',
              level: 2,
              position: { x: -160, y: -140 },
              children: [
                {
                  id: 'tableau_periodique',
                  name: 'Periodic table',
                  icon: '📋',
                  level: 3,
                  position: { x: -240, y: 0 },
                  children: [
                    {
                      id: 'elements_chimiques',
                      name: 'Chemical elements',
                      icon: '🔬',
                      level: 4,
                      position: { x: -240, y: 140 }
                    }
                  ]
                }
              ]
            },
            {
              id: 'reactions_chimiques',
              name: 'Chemical reactions',
              icon: '💥',
              level: 2,
              prerequisites: ['atomes_molecules'],
              position: { x: 160, y: -140 },
              children: [
                {
                  id: 'equilibrage_equations',
                  name: 'Balancing equations',
                  icon: '⚖️',
                  level: 3,
                  position: { x: 160, y: 0 },
                  children: [
                    {
                      id: 'stoechiometrie',
                      name: 'Stoichiometry',
                      icon: '📊',
                      level: 4,
                      position: { x: 160, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Organic chemistry branch
        {
          id: 'chimie_organique',
          name: 'Organic chemistry',
          icon: '🧬',
          level: 1,
          position: { x: -280, y: -280 },
          children: [
            {
              id: 'hydrocarbures',
              name: 'Hydrocarbons',
              icon: '⛽',
              level: 2,
              position: { x: -360, y: -140 },
              children: [
                {
                  id: 'alcanes',
                  name: 'Alkanes',
                  icon: '🔗',
                  level: 3,
                  position: { x: -440, y: 0 },
                  children: [
                    {
                      id: 'nomenclature',
                      name: 'Nomenclature',
                      icon: '📝',
                      level: 4,
                      position: { x: -440, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Physical chemistry branch
        {
          id: 'chimie_physique',
          name: 'Physical chemistry',
          icon: '⚗️',
          level: 1,
          position: { x: 280, y: -280 },
          children: [
            {
              id: 'thermochimie',
              name: 'Thermochemistry',
              icon: '🌡️',
              level: 2,
              position: { x: 360, y: -140 },
              children: [
                {
                  id: 'enthalpie',
                  name: 'Enthalpy',
                  icon: '📊',
                  level: 3,
                  position: { x: 280, y: 0 },
                  children: [
                    {
                      id: 'calorimétrie',
                      name: 'Calorimetry',
                      icon: '🔥',
                      level: 4,
                      position: { x: 280, y: 140 }
                    }
                  ]
                },
                {
                  id: 'cinetique_chimique',
                  name: 'Chemical kinetics',
                  icon: '⚡',
                  level: 3,
                  position: { x: 440, y: 0 },
                  children: [
                    {
                      id: 'vitesse_reaction',
                      name: 'Reaction rate',
                      icon: '🏃',
                      level: 4,
                      position: { x: 440, y: 140 }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const toggleNode = (nodeId: string) => {
    const newActivatedNodes = new Set(activatedNodes);
    if (newActivatedNodes.has(nodeId)) {
      newActivatedNodes.delete(nodeId);
    } else {
      newActivatedNodes.add(nodeId);
    }
    setActivatedNodes(newActivatedNodes);
  };

  const isNodeAvailable = (node: SkillNode): boolean => {
    if (!node.prerequisites) return true;
    return node.prerequisites.every(prereq => activatedNodes.has(prereq));
  };

  const getAllNodesFromTree = (tree: SkillNode[]): SkillNode[] => {
    const nodes: SkillNode[] = [];
    
    const traverse = (nodeList: SkillNode[]) => {
      nodeList.forEach(node => {
        nodes.push(node);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    
    traverse(tree);
    return nodes;
  };

  const getConnectionsFromTree = (tree: SkillNode[]): Array<{from: SkillNode, to: SkillNode}> => {
    const connections: Array<{from: SkillNode, to: SkillNode}> = [];
    
    const traverse = (nodeList: SkillNode[]) => {
      nodeList.forEach(node => {
        if (node.children) {
          node.children.forEach(child => {
            connections.push({ from: node, to: child });
          });
          traverse(node.children);
        }
      });
    };
    
    traverse(tree);
    return connections;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const allNodes = selectedSubjectData ? getAllNodesFromTree(selectedSubjectData.skillTree) : [];
  const connections = selectedSubjectData ? getConnectionsFromTree(selectedSubjectData.skillTree) : [];

  return (
    <div style={styles.container}>
      {/* Subject selector */}
      <div style={styles.subjectSelector}>
        {subjects.map(subject => (
          <button
            key={subject.id}
            style={{
              ...styles.subjectButton,
              backgroundColor: selectedSubject === subject.id ? subject.color : 'rgba(255,255,255,0.1)',
              color: selectedSubject === subject.id ? '#ffffff' : subject.color,
              borderColor: subject.color,
            }}
            onClick={() => setSelectedSubject(subject.id)}
          >
            <span style={{ fontSize: '18px', marginRight: '8px' }}>{subject.icon}</span>
            {subject.name}
          </button>
        ))}
      </div>

      <motion.div
        style={styles.talentTree}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={selectedSubject}
      >
        {/* Background grid */}
        <div style={styles.backgroundGrid} />

        {/* Level separators */}
        <div style={styles.levelSeparator1} />
        <div style={styles.levelSeparator2} />
        <div style={styles.levelSeparator3} />
        
        {/* Level labels */}
        <div style={{...styles.levelLabel, top: '20px'}}>Level 1 - Fundamental</div>
        <div style={{...styles.levelLabel, top: '160px'}}>Level 2 - Intermediate</div>
        <div style={{...styles.levelLabel, top: '300px'}}>Level 3 - Advanced</div>
        <div style={{...styles.levelLabel, top: '440px'}}>Level 4 - Expert</div>

        {/* Connection lines */}
        <svg style={styles.connectionsSvg}>
          {connections.map(({ from, to }, index) => {
            const fromPos = from.position || { x: 0, y: 0 };
            const toPos = to.position || { x: 0, y: 0 };
            const isFromActivated = activatedNodes.has(from.id);
            const isToActivated = activatedNodes.has(to.id);
            const isAvailable = isNodeAvailable(to);
            
            return (
              <motion.line
                key={`connection-${index}`}
                x1={525 + fromPos.x}
                y1={400 + fromPos.y}
                x2={525 + toPos.x}
                y2={400 + toPos.y}
                stroke={selectedSubjectData?.color || '#ffffff'}
                strokeWidth={isFromActivated && isToActivated ? "3" : isAvailable ? "2" : "1"}
                strokeOpacity={isFromActivated && isToActivated ? 0.9 : isAvailable ? 0.6 : 0.3}
                strokeDasharray={isAvailable ? "none" : "5,5"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Skill nodes */}
        <AnimatePresence>
          {allNodes.map((node, index) => {
            const isActivated = activatedNodes.has(node.id);
            const isAvailable = isNodeAvailable(node);
            const position = node.position || { x: 0, y: 0 };
            const nodeColor = selectedSubjectData?.color || '#ffffff';
            
            return (
              <motion.div
                key={node.id}
                style={{
                  ...styles.skillNode,
                  left: `${500 + position.x}px`,
                  top: `${400 + position.y}px`,
                  backgroundColor: isActivated 
                    ? nodeColor 
                    : 'transparent',
                  borderColor: nodeColor,
                  borderWidth: isActivated ? '3px' : '2px',
                  opacity: isAvailable ? 1 : 0.4,
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  boxShadow: isActivated
                    ? `0 0 20px ${nodeColor}80, 0 0 40px ${nodeColor}40`
                    : hoveredNode === node.id
                      ? `0 0 15px ${nodeColor}60`
                      : 'none',
                  transform: `translate(-50%, -50%)`,
                }}
                variants={nodeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover={isAvailable ? {
                  scale: 1.15,
                  transition: { duration: 0.2 },
                } : {}}
                whileTap={isAvailable ? { scale: 0.95 } : {}}
                onClick={() => isAvailable && toggleNode(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                title={`${node.name} (Niveau ${node.level})`}
              >
                <div style={{
                  ...styles.nodeIcon,
                  color: isActivated ? '#ffffff' : nodeColor,
                  fontSize: '16px',
                }}>
                  {node.icon || '•'}
                </div>
                <div style={{
                  ...styles.nodeText,
                  color: isActivated ? '#ffffff' : nodeColor,
                  fontSize: '10px',
                }}>
                  {node.name}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Legend */}
        <div style={styles.legend}>
          <div style={styles.legendTitle}>Skill states</div>
          <div style={styles.legendItem}>
            <div style={{
              ...styles.legendDot, 
              backgroundColor: selectedSubjectData?.color,
              border: `2px solid ${selectedSubjectData?.color}`
            }} />
            <span>Acquired skill</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{
              ...styles.legendDot, 
              backgroundColor: 'transparent',
              border: `2px solid ${selectedSubjectData?.color}`
            }} />
            <span>Unacquired skill</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{
              ...styles.legendDot, 
              backgroundColor: 'transparent',
              border: `2px solid #666666`,
              opacity: 0.4
            }} />
            <span>Locked skill</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    padding: '20px',
    position: 'relative',
    zIndex: 3,
  },
  subjectSelector: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  subjectButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    border: '2px solid',
    borderRadius: '25px',
    background: 'rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
  },
  talentTree: {
    position: 'relative',
    width: '1000px',
    height: '800px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelSeparator1: {
    position: 'absolute',
    top: '120px',
    left: '50px',
    right: '50px',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1,
  },
  levelSeparator2: {
    position: 'absolute',
    top: '260px',
    left: '50px',
    right: '50px',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1,
  },
  levelSeparator3: {
    position: 'absolute',
    top: '400px',
    left: '50px',
    right: '50px',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1,
  },
  levelLabel: {
    position: 'absolute',
    left: '20px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '4px 8px',
    borderRadius: '4px',
    backdropFilter: 'blur(5px)',
  },
  backgroundGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: `
      radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0),
      linear-gradient(0deg, rgba(255,255,255,0.02) 50%, transparent 50%),
      linear-gradient(90deg, rgba(255,255,255,0.02) 50%, transparent 50%)
    `,
    backgroundSize: '40px 40px, 40px 40px, 40px 40px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  skillNode: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.3s ease',
    userSelect: 'none',
    zIndex: 10,
  },
  nodeIcon: {
    fontSize: '16px',
    marginBottom: '2px',
    lineHeight: 1,
  },
  nodeText: {
    fontSize: '9px',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: '1.1',
    padding: '0 4px',
    maxWidth: '50px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  connectionsSvg: {
    position: 'absolute',
    width: '1000px',
    height: '800px',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    background: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '12px',
    padding: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    minWidth: '200px',
  },
  legendTitle: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '12px',
    textAlign: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '12px',
    color: '#ffffff',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: '10px',
    flexShrink: 0,
  },
};

export default TalentTree;
