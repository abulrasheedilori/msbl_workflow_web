import { useEffect } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllRequestsFromAllUsers } from "../../store/apiService";
import { RequestResponseType } from "../../store/apiTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import formatDate from "../../utils/formatDate";
import SearchFilter from "../components/SearchFilter";

const ViewRequest = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { listOfRequest, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllRequestsFromAllUsers());
  }, [dispatch, user?.roles]);

  const handleViewRequest = (id: number) => {
    navigate(`/dashboard/${id}`);
  };

  return (
    <section className="flex-1 w-full mx-auto overflow-y-auto lg:pt-8 scroll-smooth">
      <section className="sticky top-0 left-0 right-0 z-40 w-full py-2 bg-green-950 lg:static lg:bg-transparent">
        <section>
          <header className="mx-2 text-xl font-bold text-white lg:text-black text-start lg:mx-8 lg:text-4xl">
            Requests
          </header>
          <p className="mx-8 my-4 text-xs lg:text-lg">
            Welcome!, you can create or log a request here. Just fill in all the
            details and your request shall be attended to
          </p>
        </section>
        <section className="flex flex-col justify-center gap-1 mt-8 lg:items-center lg:flex-row">
          <SearchFilter />
        </section>
      </section>
      {listOfRequest?.length > 0 ? (
        <section className="flex flex-col justify-start p-2 l lg:flex-wrap lg:flex-row">
          {listOfRequest?.map((item: RequestResponseType) => {
            const { id, title, message, status, createdAt } = item;

            return (
              <section
                key={id.toString()}
                onClick={() => handleViewRequest(id)}
                className="relative w-full lg:w-[17vw] my-1 lg:mx-2 bg-slate-50 p-8 shadow-md rounded-md border-2 hover:bg-green-200 hover:border-green-900"
              >
                {item?.status && (
                  <span className="absolute p-2 text-sm shadow-md top-2 right-2 bg-red-50 rounded-xl">
                    {status?.toUpperCase()}
                  </span>
                )}

                <p className="mt-12 mb-4 text-xl font-bold text-center text-black">
                  {title}
                </p>
                <section>
                  <p className="pt-2 pb-8 overflow-hidden text-sm border-green-100 overflow-ellipsis text border-y-2">
                    {message}
                  </p>
                  <span className="mt-4 text-xs font-semibold">
                    Created on:
                  </span>
                  <p className="font-serif text-xs text-right ">
                    {formatDate?.(createdAt)}
                  </p>
                </section>
              </section>
            );
          })}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center mt-16">
          <FaShoppingBasket size={96} color="green" className="text-center" />
          <p className="text-2xl text-center text-slate-700">
            No request is available yet!
          </p>
          <p className="text-sm text-center text-slate-400">
            Create a new request from the menu on the side panel.
          </p>
        </section>
      )}
    </section>
  );
};

export default ViewRequest;
