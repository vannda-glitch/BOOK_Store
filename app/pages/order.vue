<script setup lang="ts">

definePageMeta({
  layout: "default",
});


// =========================================================
// CART
// =========================================================

const {
  cart,
  clearCart,
  loadCart
} = useCart();


// =========================================================
// API
// =========================================================

const API_URL = "http://localhost:8000";

const KHQR_API_URL = "http://localhost:5000";


// =========================================================
// CHECKOUT STATE
// =========================================================

const loading = ref(false);

const orderPlaced = ref(false);

const orderError = ref("");


// =========================================================
// CUSTOMER FORM
// =========================================================

const orderForm = reactive({

  firstName: "",

  lastName: "",

  email: "",

  phone: "",

  address: "",

  city: "",

  postalCode: "",

});


// =========================================================
// KHQR STATE
// =========================================================

const showKHQR = ref(false);

const qrImage = ref("");

const transactionMd5 = ref("");

const paymentStatus = ref("");

const checkingPayment = ref(false);

let paymentTimer:
  ReturnType<typeof setInterval> | null = null;


// =========================================================
// SUBTOTAL
// =========================================================

const subtotal = computed(() => {

  return cart.value.reduce(

    (total, item) =>

      total +
      Number(item.price) *
      item.quantity,

    0

  );

});


// =========================================================
// SHIPPING
// =========================================================

const shipping = computed(() => {

  if (subtotal.value >= 100) {

    return 0;

  }

  return 5;

});


// =========================================================
// TOTAL
// =========================================================

const total = computed(() => {

  return (
    subtotal.value +
    shipping.value
  );

});


// =========================================================
// GENERATE KHQR
// =========================================================

const generateKHQR = async () => {

  try {

    loading.value = true;

    orderError.value = "";


    // ---------------------------------------------------
    // CALL PYTHON
    // ---------------------------------------------------

    const response = await $fetch<any>(

      `${KHQR_API_URL}/api/generate-qr`,

      {

        method: "POST",

        body: {

          amount: total.value,

          currency: "USD",

          description:
            "Book Store Purchase",

        },

      }

    );


    // ---------------------------------------------------
    // CHECK RESPONSE
    // ---------------------------------------------------

    if (!response.success) {

      throw new Error(

        response.error ||
        "Failed to generate KHQR"

      );

    }


    // ---------------------------------------------------
    // SAVE KHQR DATA
    // ---------------------------------------------------

    qrImage.value =
      response.qr_image;

    transactionMd5.value =
      response.md5;

    paymentStatus.value =
      response.status;


    // ---------------------------------------------------
    // SHOW QR
    // ---------------------------------------------------

    showKHQR.value = true;


    // ---------------------------------------------------
    // START CHECKING PAYMENT
    // ---------------------------------------------------

    startPaymentChecking();

  }

  catch (error) {

    console.error(
      "Generate KHQR error:",
      error
    );

    orderError.value =

      error instanceof Error

        ? error.message

        : "Unable to generate KHQR.";

  }

  finally {

    loading.value = false;

  }

};


// =========================================================
// CHECK PAYMENT
// =========================================================

const checkPayment = async () => {

  if (!transactionMd5.value) {

    return;

  }


  try {

    checkingPayment.value = true;


    const response =
      await $fetch<any>(

        `${KHQR_API_URL}/api/check-payment`,

        {

          method: "GET",

          params: {

            md5:
              transactionMd5.value,

          },

        }

      );


    console.log(
      "Payment response:",
      response
    );


    paymentStatus.value =
      response.status;


    // ---------------------------------------------------
    // PAYMENT SUCCESS
    // ---------------------------------------------------

    if (
      response.status === "PAID"
    ) {

      stopPaymentChecking();


      showKHQR.value = false;


      await completeOrder();

    }

  }

  catch (error) {

    console.error(
      "Check payment error:",
      error
    );

  }

  finally {

    checkingPayment.value = false;

  }

};


// =========================================================
// START PAYMENT CHECK
// =========================================================

const startPaymentChecking = () => {

  stopPaymentChecking();


  paymentTimer =
    setInterval(

      () => {

        checkPayment();

      },

      5000

    );

};


// =========================================================
// STOP PAYMENT CHECK
// =========================================================

const stopPaymentChecking = () => {

  if (paymentTimer) {

    clearInterval(
      paymentTimer
    );

    paymentTimer = null;

  }

};


// =========================================================
// COMPLETE ORDER
// =========================================================

const completeOrder = async () => {

  loading.value = true;

  orderError.value = "";


  const decrementedBooks:
    Array<{
      id: string | number;
      stock: number;
    }> = [];


  try {

    // ===================================================
    // CHECK STOCK
    // ===================================================

    for (
      const item of cart.value
    ) {

      const bookId =
        item.productId ??
        item.id;


      const book =
        await $fetch<any>(

          `${API_URL}/books/${bookId}`

        );


      const stock =
        Math.max(

          0,

          Number(book.stock) || 0

        );


      if (
        item.quantity > stock
      ) {

        throw new Error(

          `${item.title} has only ${stock} ${
            stock === 1
              ? "copy"
              : "copies"
          } available.`

        );

      }


      // -------------------------------------------------
      // UPDATE STOCK
      // -------------------------------------------------

      await $fetch(

        `${API_URL}/books/${book.id}`,

        {

          method: "PATCH",

          body: {

            stock:
              stock -
              item.quantity,

          },

        }

      );


      decrementedBooks.push({

        id: book.id,

        stock,

      });

    }


    // ===================================================
    // CREATE ORDER
    // ===================================================

    await $fetch(

      `${API_URL}/orders`,

      {

        method: "POST",

        body: {

          customerName:

            `${orderForm.firstName} ${orderForm.lastName}`
              .trim(),

          email:

            orderForm.email
              .trim()
              .toLowerCase(),

          phone:

            orderForm.phone.trim(),

          address:

            orderForm.address.trim(),

          city:

            orderForm.city.trim(),

          postalCode:

            orderForm.postalCode.trim(),

          items:

            cart.value.map(
              (item) => ({
                ...item
              })
            ),

          subtotal:

            subtotal.value,

          shipping:

            shipping.value,

          total:

            total.value,

          status: "paid",

          paymentMethod:
            "KHQR",

          paymentMd5:
            transactionMd5.value,

          createdAt:
            new Date().toISOString(),

        },

      }

    );


    // ===================================================
    // SUCCESS
    // ===================================================

    orderPlaced.value = true;


    await clearCart();

  }

  catch (error) {

    console.error(
      "Complete order error:",
      error
    );


    // ===================================================
    // RESTORE STOCK
    // ===================================================

    for (
      const book of decrementedBooks
    ) {

      await $fetch(

        `${API_URL}/books/${book.id}`,

        {

          method: "PATCH",

          body: {

            stock:
              book.stock,

          },

        }

      ).catch(
        () => undefined
      );

    }


    orderError.value =

      error instanceof Error

        ? error.message

        : "Unable to complete order.";

  }

  finally {

    loading.value = false;

  }

};


// =========================================================
// CANCEL PAYMENT
// =========================================================

const cancelPayment = () => {

  stopPaymentChecking();

  showKHQR.value = false;

};


// =========================================================
// LOAD CART
// =========================================================

onMounted(() => {

  loadCart();

});


// =========================================================
// CLEANUP
// =========================================================

onBeforeUnmount(() => {

  stopPaymentChecking();

});

</script>


<template>

  <div>

    <!-- ================================================= -->
    <!-- ORDER SUCCESS -->
    <!-- ================================================= -->

    <div
      v-if="orderPlaced"
      class="p-10 text-center"
    >

      <h1>
        Order Placed Successfully!
      </h1>

      <p>
        Thank you for your purchase.
      </p>

      <NuxtLink
        to="/browse"
      >
        Continue Shopping
      </NuxtLink>

    </div>


    <!-- ================================================= -->
    <!-- CHECKOUT -->
    <!-- ================================================= -->

    <div
      v-else-if="cart.length > 0"
      class="p-6"
    >

      <h1>
        Checkout
      </h1>


      <!-- ERROR -->

      <div
        v-if="orderError"
        class="text-red-500"
      >

        {{ orderError }}

      </div>


      <!-- ================================================= -->
      <!-- CUSTOMER FORM -->
      <!-- ================================================= -->

      <form
        @submit.prevent="generateKHQR"
      >

        <div>

          <label>
            First Name
          </label>

          <input
            v-model="orderForm.firstName"
            type="text"
            required
          />

        </div>


        <div>

          <label>
            Last Name
          </label>

          <input
            v-model="orderForm.lastName"
            type="text"
            required
          />

        </div>


        <div>

          <label>
            Email
          </label>

          <input
            v-model="orderForm.email"
            type="email"
            required
          />

        </div>


        <div>

          <label>
            Phone
          </label>

          <input
            v-model="orderForm.phone"
            type="tel"
            required
          />

        </div>


        <div>

          <label>
            Address
          </label>

          <input
            v-model="orderForm.address"
            type="text"
            required
          />

        </div>


        <div>

          <label>
            City
          </label>

          <input
            v-model="orderForm.city"
            type="text"
            required
          />

        </div>


        <div>

          <label>
            Postal Code
          </label>

          <input
            v-model="orderForm.postalCode"
            type="text"
            required
          />

        </div>


        <!-- ================================================= -->
        <!-- ORDER SUMMARY -->
        <!-- ================================================= -->

        <div>

          <p>
            Subtotal:
            ${{ subtotal.toFixed(2) }}
          </p>

          <p>
            Shipping:
            {{
              shipping === 0
                ? "Free"
                : "$" +
                  shipping.toFixed(2)
            }}
          </p>

          <p>
            Total:
            ${{ total.toFixed(2) }}
          </p>

        </div>


        <!-- ================================================= -->
        <!-- PAY BUTTON -->
        <!-- ================================================= -->

        <button
          type="submit"
          :disabled="loading"
        >

          {{
            loading
              ? "Generating KHQR..."
              : `Pay $${total.toFixed(2)} with KHQR`
          }}

        </button>

      </form>

    </div>


    <!-- ================================================= -->
    <!-- EMPTY CART -->
    <!-- ================================================= -->

    <div
      v-else
      class="p-10 text-center"
    >

      <h1>
        Your cart is empty
      </h1>

      <NuxtLink
        to="/browse"
      >
        Browse Books
      </NuxtLink>

    </div>


    <!-- ================================================= -->
    <!-- KHQR -->
    <!-- ================================================= -->

    <div
      v-if="showKHQR"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >

      <div
        class="bg-white p-6 text-center"
      >

        <h2>
          Scan KHQR to Pay
        </h2>


        <!-- QR -->

        <img
          v-if="qrImage"
          :src="qrImage"
          alt="KHQR"
          class="mx-auto mt-4 h-64 w-64"
        />


        <!-- AMOUNT -->

        <p class="mt-4">

          Amount:

          <strong>
            ${{ total.toFixed(2) }}
          </strong>

        </p>


        <!-- STATUS -->

        <p class="mt-3">

          Status:

          <strong>

            {{ paymentStatus }}

          </strong>

        </p>


        <!-- CHECKING -->

        <p
          v-if="checkingPayment"
        >

          Checking payment...

        </p>


        <!-- CANCEL -->

        <button
          type="button"
          @click="cancelPayment"
        >

          Cancel

        </button>

      </div>

    </div>

  </div>

</template>