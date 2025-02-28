import { Instruction } from './types';

const instructionRegex = /^\s*([a-z]+(?:\.[bwl])?)\s*(.+)?$/i;
const commentRegex = /;.*$/;
const labelRegex = /^[A-Za-z_][A-Za-z0-9_]*:/;

export function parseInstruction(line: string): Instruction | null {
  // Ignorer les commentaires et les lignes vides
  line = line.replace(commentRegex, '').trim();
  if (!line || labelRegex.test(line)) return null;

  const match = line.match(instructionRegex);
  if (!match) return null;

  const [, mnemonic, operands] = match;
  const size = mnemonic.includes('.') ? mnemonic.split('.')[1].length : 2;
  
  return {
    mnemonic: mnemonic.toLowerCase(),
    size,
    cycles: 4, // Cycles de base, sera ajusté par l'analyseur
    ea: parseOperands(operands)
  };
}

function parseOperands(operands?: string): string | undefined {
  if (!operands) return undefined;
  
  // Nettoyage des espaces
  operands = operands.trim();
  
  // Détection des modes d'adressage
  if (operands.match(/^[ad][0-7]$/i)) {
    return operands.charAt(0).toUpperCase() + 'n';
  }
  
  if (operands.match(/^\([a-z][0-7]\)$/i)) {
    return '(An)';
  }
  
  if (operands.match(/^\([a-z][0-7]\)\+$/i)) {
    return '(An)+';
  }
  
  if (operands.match(/^-\([a-z][0-7]\)$/i)) {
    return '-(An)';
  }
  
  if (operands.includes('(a') && !operands.includes(',')) {
    return 'd16(An)';
  }
  
  if (operands.includes('(a') && operands.includes(',')) {
    return 'd8(An,Dn)';
  }
  
  if (operands.startsWith('#')) {
    return '#imm';
  }
  
  if (operands.endsWith('.w')) {
    return '(xxx).W';
  }
  
  if (operands.endsWith('.l')) {
    return '(xxx).L';
  }
  
  return operands;
}