import { Check, X } from "lucide-react";

const passwordConditions = [
  {
    label: "Contains more than 6 characters",
    regex: /^.{6,}$/,
  },
  {
    label: "Contains an Uppercase letter",
    regex: /[A-Z]/,
  },
  { label: "Contains a lowercase letter", regex: /[a-z]/ },
  { label: "Contains a digit", regex: /\d/ },
  {
    label: "Contains a special character",
    regex: /[^A-Za-z0-9]/,
  },
];

const PasswordCriteria = (password) => {
  let strength = 0;
  const updatedConditions = passwordConditions.map((condition) => {
    const met = condition.regex.test(password);
    if (met) strength++;
    return {
      ...condition,
      met,
    };
  });

  return { strength, updatedConditions };
};

const strengthLevels = (strength) => {
  if (strength === 0 || strength === 1)
    return { text: "Very Weak", bgColor: "bg-red-500" };
  if (strength === 2) return { text: "Weak", bgColor: "bg-red-400" };
  if (strength === 3) return { text: "Fair", bgColor: "bg-yellow-500" };
  if (strength === 4) return { text: "Good", bgColor: "bg-yellow-400" };
  if (strength === 5) return { text: "Strong", bgColor: "bg-green-500" };
};

const PasswordStrengthMeter = ({ password }) => {
  const { strength, updatedConditions } = PasswordCriteria(password);
  const { text: strengthText, bgColor: strengthBarBgColor } =
    strengthLevels(strength);

  return (
    <div className="mt-5">
      <div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Password strength</span>
          <span className="text-xs text-gray-400">{strengthText}</span>
        </div>

        {/* Strength bar */}
        <div className="flex space-x-1 mt-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                index < strength ? strengthBarBgColor : "bg-gray-700"
              }`}
            ></div>
          ))}
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {updatedConditions.map((item) => (
          <div key={item.label} className="flex items-center gap-x-2 text-sm">
            {item.met ? (
              <Check className="size-4 text-green-400" />
            ) : (
              <X className="size-4 text-gray-400" />
            )}

            <p className={item.met ? "text-green-400" : "text-gray-400"}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PasswordStrengthMeter;
