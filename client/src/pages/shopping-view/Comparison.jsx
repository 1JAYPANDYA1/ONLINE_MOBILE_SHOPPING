import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const compareNumericalValues = (value1, value2) => {
  return parseFloat(value1) >= parseFloat(value2);
};

const compareValues = (value1, value2, order) => {
  const ranking = order.split('>').map(item => item.trim().toLowerCase());
  const index1 = ranking.indexOf(value1.toLowerCase());
  const index2 = ranking.indexOf(value2.toLowerCase());
  return index1 <= index2;
};

const ComparisonIcon = ({ isGreater }) => {
  return isGreater ? (
    <CheckCircle className="text-green-500" />
  ) : (
    <XCircle className="text-red-500" />
  );
};

const Comparison = () => {
  const [phones, setPhones] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState([0, 0]);
  const [recommendedPhone, setRecommendedPhone] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/a1/getdata/");
      const { phones: phonesData, accessories: accessoriesData } = response.data;
      setPhones(phonesData);
      setAccessories(accessoriesData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (phones.length === 2 && accessories.length === 2) {
      calculateScores();
    }
  }, [phones, accessories]);

  const calculateScores = () => {
    const newScores = [1, 1];
    const comparisonFields = [
      { field: 'ram', accessor: (item) => item.ram },
      { field: 'storage', accessor: (item) => item.storage },
      { field: 'originalprice', accessor: (item) => item.originalprice },
      { field: 'saleprice', accessor: (item) => item.saleprice },
      { field: 'antutuscore', accessor: (item) => accessories[phones.indexOf(item)].antutuscore },
      { field: 'camera_mp', accessor: (item) => accessories[phones.indexOf(item)].camera_mp },
      { field: 'battery_cap', accessor: (item) => accessories[phones.indexOf(item)].battery_cap },
      { field: 'processor', accessor: (item) => accessories[phones.indexOf(item)].antutuscore }, // Add processor comparison based on Antutu score
    ];

    comparisonFields.forEach(({ field, accessor }) => {
      const value1 = accessor(phones[0]);
      const value2 = accessor(phones[1]);
      if (compareNumericalValues(value1, value2)) {
        newScores[0]++;
      }
      if (compareNumericalValues(value2, value1)) {
        newScores[1]++;
      }
    });

    setScores(newScores);

    // Determine the recommended phone
    if (newScores[0] > newScores[1]) {
      setRecommendedPhone(phones[0]);
    } else if (newScores[1] > newScores[0]) {
      setRecommendedPhone(phones[1]);
    } else {
      setRecommendedPhone(null); // In case of a tie
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (phones.length === 0 && accessories.length === 0) {
    return <div className="text-center py-8">No data found</div>;
  }

  return (
    <div className="flex min-h-screen bg-white text-black flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-8">Phone and Accessories Comparison</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {phones.slice(0, 2).map((phone, index) => (
          <div key={index} className="bg-gray-200 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {phone.phone_brand} {phone.phone_name}
            </h2>
            <img
              src={phone.phone_img}
              alt={phone.phone_name}
              className="w-full h-auto max-h-64 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p><strong>RAM:</strong> {phone.ram} GB</p>
                <ComparisonIcon isGreater={compareNumericalValues(phone.ram, phones[1 - index].ram)} />
              </div>
              <div className="flex items-center justify-between">
                <p><strong>Storage:</strong> {phone.storage} GB</p>
                <ComparisonIcon isGreater={compareNumericalValues(phone.storage, phones[1 - index].storage)} />
              </div>
              <p><strong>Color:</strong> {phone.color}</p>
              <div className="flex items-center justify-between">
                <p><strong>Original Price:</strong> ₹{phone.originalprice.toLocaleString()}</p>
                <ComparisonIcon isGreater={compareNumericalValues(phone.originalprice, phones[1 - index].originalprice)} />
              </div>
              <div className="flex items-center justify-between">
                <p><strong>Sale Price:</strong> ₹{phone.saleprice.toLocaleString()}</p>
                <ComparisonIcon isGreater={compareNumericalValues(phone.saleprice, phones[1 - index].saleprice)} />
              </div>
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <p><strong>Display:</strong> {accessories[index].display_type}</p>
                <ComparisonIcon
                  isGreater={compareValues(
                    accessories[index].display_type,
                    accessories[1 - index].display_type,
                    "POLED > AMOLED > LCD"
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <p><strong>Processor:</strong> {accessories[index].processor}</p>
                <ComparisonIcon isGreater={compareNumericalValues(accessories[index].antutuscore, accessories[1 - index].antutuscore)} />
              </div>
              <div className="flex items-center justify-between">
                <p><strong>Antutu Score:</strong> {accessories[index].antutuscore}</p>
                <ComparisonIcon isGreater={compareNumericalValues(accessories[index].antutuscore, accessories[1 - index].antutuscore)} />
              </div>
              <div className="flex items-center justify-between">
                <p><strong>Camera Sensor:</strong> {accessories[index].camera_sensor}</p>
                <ComparisonIcon
                  isGreater={compareValues(
                    accessories[index].camera_sensor,
                    accessories[1 - index].camera_sensor,
                    "SonyIMX9 > SonyIMX8 > SonyIMX7"
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <p><strong>Camera MP:</strong> {accessories[index].camera_mp} MP</p>
                <ComparisonIcon isGreater={compareNumericalValues(accessories[index].camera_mp, accessories[1 - index].camera_mp)} />
              </div>
              <div className="flex items-center justify-between">
                <p><strong>Battery:</strong> {accessories[index].battery_cap} mAh</p>
                <ComparisonIcon isGreater={compareNumericalValues(accessories[index].battery_cap, accessories[1 - index].battery_cap)} />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xl font-bold">Score: {scores[index]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Section */}
      <div className="mt-8">
        {recommendedPhone ? (
          <p className="text-2xl font-bold text-center">
            Recommended Phone: {recommendedPhone.phone_brand} {recommendedPhone.phone_name}
          </p>
        ) : (
          <p className="text-2xl font-bold text-center">Both phones are equally recommended.</p>
        )}
      </div>
    </div>
  );
};

export default Comparison;
