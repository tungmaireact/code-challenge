// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the validation schema using Zod
const schema = z.object({
  fromCurrency: z.string().nonempty("Please select a currency to swap from."),
  toCurrency: z.string().nonempty("Please select a currency to swap to."),
  fromAmount: z
    .number({ invalid_type_error: "Amount must be a number." })
    .positive("Amount must be greater than zero.")
    .min(0.01, "Minimum amount is 0.01."),
  toAmount: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

type Token = {
  name: string;
  price?: number;
  icon: string;
};

const CurrencySwapForm: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromAmount: 0,
      fromCurrency: "",
      toCurrency: "",
      toAmount: 0,
    },
  });

  const fromCurrency = watch("fromCurrency");
  const toCurrency = watch("toCurrency");

  useEffect(() => {
    async function fetchTokens() {
      const response = await fetch("https://interview.switcheo.com/prices.json");
      const data = await response.json();

      // Extract unique currencies from the data
      const formattedTokens: Token[] = [];
      const seenCurrencies = new Set();
      data.forEach((price: { currency: string; price: number }) => {
        if (!seenCurrencies.has(price.currency)) {
          seenCurrencies.add(price.currency);
          formattedTokens.push({
            name: price.currency,
            price: price.price,
            icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${price.currency}.svg`,
          });
        }
      });
      setTokens(formattedTokens);
    }
    fetchTokens();
  }, []);


  const onSubmit = (data: FormValues) => {
    const fromToken = tokens.find((t) => t.name === data.fromCurrency);
    const toToken = tokens.find((t) => t.name === data.toCurrency);

    if (!fromToken || !toToken) {
      alert("Invalid token selection. Please select valid currencies.");
      return;
    }

    if (!fromToken.price || !toToken.price) {
      alert("Exchange rate not available for selected tokens.");
      return;
    }

    const rate = toToken.price / fromToken.price;
    const calculatedAmount = Number((data.fromAmount * rate).toFixed(8));

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setValue("toAmount", calculatedAmount);
    }, 2000);
  };

  const renderDropdown = (field: {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur: () => void;
  }) => (
    <div>
      <div className="relative">
        <select
          {...field}
          className="w-full border rounded p-2 pl-10 text-sm appearance-none"
        >
          <option value="">Select</option>
          {tokens.map((token) => (
            <option key={token.name} value={token.name}>
              {token.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {field.value && (
            <img
              src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${field.value}.svg`}
              alt={field.value}
              className="w-5 h-5"
            />
          )}
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen grid place-items-center">
      <div className="w-[550px] mx-auto mt-10 p-10 bg-white shadow-3xl rounded-3xl">
        <h2 className="text-3xl font-bold mt-4 mb-8 uppercase text-center font-title">Currency swap form</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="number"
                step="0.01"
                {...register("fromAmount", { valueAsNumber: true })}
                className="w-full border rounded p-2 text-sm"
              />
              {errors.fromAmount && (
                <p className="text-red-500 text-xs mt-1">{errors.fromAmount.message}</p>
              )}
            </div>
            <div className="relative flex-1">
              <Controller
                name="fromCurrency"
                control={control}
                render={({ field }) => renderDropdown(field)}
              />
              {errors.fromCurrency && (
                <p className="text-red-500 text-xs mt-1">{errors.fromCurrency.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center my-2">
            <button
              type="button"
              className="p-4 bg-gray-200 rounded-full hover:bg-gray-300 transition-transform hover:rotate-180"
              onClick={() => {
                const tempCurrency = fromCurrency;
                setValue("fromCurrency", toCurrency);
                setValue("toCurrency", tempCurrency);
                setValue("fromAmount", 0);
                setValue("toAmount", 0);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h8m0 0l-4-4m4 4l-4 4m0 6h-8m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="number"
                step="0.01"
                {...register("toAmount", { valueAsNumber: true })}
                readOnly
                className="w-full border rounded p-2 text-sm bg-gray-100"
              />
            </div>
            <div className="relative flex-1">
              <Controller
                name="toCurrency"
                control={control}
                render={({ field }) => renderDropdown(field)}
              />
              {errors.toCurrency && (
                <p className="text-red-500 text-xs mt-1">{errors.toCurrency.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl hover:bg-blue-700 !mt-10"
            disabled={loading}
          >
            {loading ? "Swapping..." : "Swap"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CurrencySwapForm;
