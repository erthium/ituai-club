'use client';

import { AgentGuess } from "@/interfaces/turing/agent-guess";

interface Props {
  agent_guesses: AgentGuess[];
  onRestart: () => void;
}

const TuringTestResult: React.FC<Props> = ({ agent_guesses, onRestart }) => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="flex flex-col items-center lg:mx-96 px-12 py-8 rounded-xl bg-zinc-900">
        <h2 className="text-xl lg:text-3xl font-bold text-center mb-6 text-zinc-100">
          Test Ended
        </h2>
        {/* Agent Guesses */}
        <div className="flex flex-col items-center justify-center w-full h-full gap-y-2 lg:gap-y-4 p-0 lg:p-4 rounded-xl overflow-y-auto mb-6">
          {agent_guesses.map((agent_guess, index) => (
            <div key={index} className="flex flex-col items-center justify-center rounded-xl transition-all duration-400">
              <p className="text-base lg:text-lg text-zinc-100">
                {agent_guess.agent.name}: {agent_guess.guess}
              </p>
            </div>
          ))}
        </div>
        <button className="px-12 py-2 border-2 border-zinc-400 rounded-xl transition-all duration-400 text-zinc-400 hover:border-zinc-600 hover:text-zinc-600 disabled:border-zinc-800 disabled:text-zinc-400 disabled:bg-zinc-800"
          onClick={onRestart}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default TuringTestResult;
