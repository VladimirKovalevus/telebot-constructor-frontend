import { Link } from "react-router-dom";

interface IBotList {
  id: number;
  name: string;
  description: string;
}

const BotList = ({ id, name, description }: IBotList) => {
  return (
    <div className="collapse bg-base-200">
      <input className="z-10" type="checkbox" />
      <div className="collapse-title flex items-center justify-between px-5 text-xl font-medium">
        <div>{name}</div>
        <div className="z-20 flex cursor-default items-center gap-4">
          <Link to={`/bot`} className="h-full w-full p-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Link>
          <button className="h-full w-full p-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>
          <Link
            to={`/status/${id}`}
            className="badge badge-error badge-xs"
          ></Link>
        </div>
      </div>
      <div className="collapse-content flex flex-col gap-3">
        <p>{description}</p>
        <input
          type="text"
          placeholder="API key"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
    </div>
  );
};

export default BotList;
