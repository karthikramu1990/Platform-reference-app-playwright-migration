import { step } from 'allure-js-commons';

// Prints a message and records it as an (empty) Allure step so it shows in the report timeline.
export async function logStep(message: string): Promise<void> {
  console.log(message);
  await step(message, async () => {});
}
