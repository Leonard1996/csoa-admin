import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../../common/helpers/axios.instance";
import { finishLoader, startLoader } from "../../../../features/user/userSlice";
import BusinessCalendarModal from "../components/BusinessCalendarModal";
import BusinessesReserveForm from "../components/BusinessReserveForm";

export default function Calendar() {
  const [business, setBusiness] = useState(null);
  const complexId = useSelector((state) => state?.user?.user?.complexId);

  useEffect(() => {
    if (!complexId) return;
    fetchBusiness(complexId);
  }, []);

  const dispatch = useDispatch();

  const fetchBusiness = async (complexId) => {
    dispatch(startLoader());
    try {
      const result = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + "/complexes/" + complexId
      );
      setBusiness(result.data.data.complex[0]);
    } catch (error) {
      console.log("error");
    }
    dispatch(finishLoader());
  };

  return (
    <>
      {business ? (
        <BusinessesReserveForm
          handleClose={() => console.log("for user")}
          business={business}
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Ju nuk keni krijuar kompleks
        </div>
      )}
    </>
  );
}
