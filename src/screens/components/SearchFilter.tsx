import { useState } from "react";
import {
  getAllRequestsFromAllUsers,
  getRequestsWithComments,
  searchRequest,
} from "../../store/apiService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function SearchFilter() {
  const [input, setInput] = useState("");
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleSearchRequest = (input: string) => {
    setInput(input);
    input.length > 0
      ? dispatch(searchRequest(input))
      : user?.roles.includes("ROLE_INITIATOR")
      ? dispatch(getRequestsWithComments())
      : dispatch(getAllRequestsFromAllUsers());
  };

  return (
    <section>
      <input
        type="search"
        value={input}
        onChange={(e) => handleSearchRequest(e.target.value)}
        placeholder="Search for request"
        className="w-[96vw] px-2 lg:w-[40vw] h-10 mx-[2vw] border-2 rounded-md outline-none focus:border-green-600"
      />
    </section>
  );
}

export default SearchFilter;
