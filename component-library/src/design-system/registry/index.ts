import componentData from "./components.json";
import patternData from "./patterns.json";
import screenData from "./screens.json";
import visualRegressionData from "./visual-regression.json";
import type {
  ComponentRegistry,
  PatternRegistry,
  ScreenRegistry,
  VisualRegressionRegistry,
} from "./registry.types";

export type * from "./registry.types";

export const componentRegistry = componentData as ComponentRegistry;
export const patternRegistry = patternData as PatternRegistry;
export const screenRegistry = screenData as ScreenRegistry;
export const visualRegressionRegistry = visualRegressionData as VisualRegressionRegistry;

export function getComponent(id: string) {
  return componentRegistry.components.find((component) => component.id === id);
}

export function getPattern(id: string) {
  return patternRegistry.patterns.find((pattern) => pattern.id === id);
}

export function getScreen(id: string) {
  return screenRegistry.screens.find((screen) => screen.id === id);
}

/** AI나 생성 스크립트가 화면 하나를 구현하기 전에 읽어야 할 최소 컨텍스트를 반환한다. */
export function getImplementationContext(screenId: string) {
  const screen = getScreen(screenId);
  if (!screen) return undefined;
  const pattern = getPattern(screen.patternId);
  if (!pattern) return undefined;
  return {
    screen,
    pattern,
    components: pattern.requiredComponents.map(getComponent).filter(Boolean),
  };
}
