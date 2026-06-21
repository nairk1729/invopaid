import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function CreateInvoice() {
const [invoice, setInvoice] = useState(() => ({
    businessName: "",
    logo: "",
    signature: "",
  invoiceNumber: `INV-${Date.now()}`,
  invoiceDate: new Date().toISOString().slice(0, 10),
  currency: "USD",
  projectStartDate: "",
  dueDate: "",
  clientName: "",
  clientEmail: "",
 lineItems: [
  {
    description: "",
    amount: ""
  }
],
  notes: "",
  paymentTerms: ""
}));
const invoiceRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setInvoice({
      ...invoice,
      [name]: value
    });
  }

 function handleLineItemChange(index, event) {
  const { name, value } = event.target;

  const updatedLineItems = [...invoice.lineItems];

  updatedLineItems[index] = {
    ...updatedLineItems[index],
    [name]: value
  };

  setInvoice({
    ...invoice,
    lineItems: updatedLineItems
  });
}

function addLineItem() {
  setInvoice({
    ...invoice,
    lineItems: [
      ...invoice.lineItems,
      {
        description: "",
        amount: ""
      }
    ]
  });
}

function getInvoiceTotal() {
  return invoice.lineItems.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
}

function handleLogoUpload(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  if (file.size > 1024 * 1024) {
    alert("Please upload a logo smaller than 1MB.");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    setInvoice({
      ...invoice,
      logo: reader.result
    });
  };

  reader.readAsDataURL(file);
}

function handleSignatureUpload(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  if (file.size > 1024 * 1024) {
    alert("Please upload a signature smaller than 1MB.");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    setInvoice({
      ...invoice,
      signature: reader.result
    });
  };

  reader.readAsDataURL(file);
}


async function downloadInvoicePdf() {
  const invoiceElement = invoiceRef.current;

  if (!invoiceElement) return;

  const canvas = await html2canvas(invoiceElement, {
    scale: 2,
    useCORS: true
  });

  const imageData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${invoice.invoiceNumber}.pdf`);
}

  return (
    <div style={{ maxWidth: "800px", margin: "80px auto", color: "white" }}>
      <h1>Create Invoice</h1>
      <p>Create a simple freelancer invoice with service details.</p>

      <label>Business Name</label>
<input
  name="businessName"
  value={invoice.businessName}
  onChange={handleChange}
/>

<div style={{ marginBottom: "20px" }}>
  <label>Business Logo</label>

  <input
    type="file"
    accept="image/png,image/jpeg"
    onChange={handleLogoUpload}
  />

  <small
    style={{
      display: "block",
      color: "#bbb",
      marginTop: "6px"
    }}
  >
    PNG/JPG, max 2MB
    <br />
    Recommended: 300×300px
  </small>
</div>

<div style={{ marginBottom: "20px" }}>
  <label>Signature</label>

  <input
    type="file"
    accept="image/png,image/jpeg"
    onChange={handleSignatureUpload}
  />

  <small
    style={{
      display: "block",
      color: "#bbb",
      marginTop: "6px"
    }}
  >
    PNG/JPG, max 1MB
    <br />
    Recommended: transparent background
  </small>
</div>

      <div style={{ marginBottom: "20px" }}>
        <label>Invoice Number</label>
        <input
          name="invoiceNumber"
          value={invoice.invoiceNumber}
          onChange={handleChange}
          style={{ display: "block", width: "100%", padding: "10px" }}
        />
      </div>


<div style={{ marginBottom: "20px" }}>
  <label>Invoice Date</label>
  <input
    type="date"
    name="invoiceDate"
    value={invoice.invoiceDate}
    onChange={handleChange}
    style={{ display: "block", width: "100%", padding: "10px" }}
  />
</div>

<div style={{ marginBottom: "20px" }}>
  <label>Project Start Date</label>
  <input
    type="date"
    name="projectStartDate"
    value={invoice.projectStartDate}
    onChange={handleChange}
    style={{ display: "block", width: "100%", padding: "10px" }}
  />
</div>

<div style={{ marginBottom: "20px" }}>
  <label>Due Date</label>
  <input
    type="date"
    name="dueDate"
    value={invoice.dueDate}
    onChange={handleChange}
    style={{ display: "block", width: "100%", padding: "10px" }}
  />
</div>

<div style={{ marginBottom: "20px" }}>
  <label>Currency</label>
  <select
    name="currency"
    value={invoice.currency}
    onChange={handleChange}
    style={{ display: "block", width: "100%", padding: "10px" }}
  >
    <option value="USD">USD</option>
    <option value="INR">INR</option>
    <option value="AED">AED</option>
  </select>
</div>

      <div style={{ marginBottom: "20px" }}>
        <label>Client Name</label>
        <input
          name="clientName"
          value={invoice.clientName}
          onChange={handleChange}
          style={{ display: "block", width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Client Email</label>
        <input
          name="clientEmail"
          value={invoice.clientEmail}
          onChange={handleChange}
          style={{ display: "block", width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
  <h2>Services & Deliverables</h2>

  {invoice.lineItems.map((item, index) => (
    <div
      key={index}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 160px",
        gap: "12px",
        marginBottom: "12px"
      }}
    >
        
      <input
        name="description"
        placeholder="Service description"
        value={item.description}
        onChange={(event) => handleLineItemChange(index, event)}
        style={{ padding: "10px" }}
      />

      <input
        name="amount"
        placeholder="Amount"
        value={item.amount}
        onChange={(event) => handleLineItemChange(index, event)}
        style={{ padding: "10px" }}
      />
    </div>
  ))}

  <button type="button" onClick={addLineItem}>
    Add Service
  </button>
  <div style={{ marginBottom: "20px" }}>
  <label>Payment Terms</label>
  <input
    name="paymentTerms"
    value={invoice.paymentTerms}
    onChange={handleChange}
    placeholder="Example: 50% advance payable before project start"
    style={{ display: "block", width: "100%", padding: "10px" }}
  />
</div>
</div>
      <div style={{ marginBottom: "20px" }}>
        <label>Notes</label>
        <textarea
          name="notes"
          value={invoice.notes}
          onChange={handleChange}
          style={{ display: "block", width: "100%", padding: "10px" }}
        />
      </div>

     <div
  style={{
    color: "#111",
    padding: "24px",
    marginTop: "32px"
  }}
>
  <div
    ref={invoiceRef}
    style={{
      backgroundColor: "white",
      color: "#111",
      padding: "32px",
      marginTop: "32px",
      textAlign: "left"
    }}
  >

  <h1 style={{ textAlign: "right", marginBottom: "24px" }}>
    INVOICE
  </h1>
  <hr style={{ marginBottom: "24px" }} />

  <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "80px",
    marginBottom: "32px",
    alignItems: "start"
  }}
>
<div>
  {invoice.logo && (
    <img
  src={invoice.logo}
  alt="Business Logo"
  style={{
    maxWidth: "180px",
    maxHeight: "120px",
    objectFit: "contain",
    borderRadius: "8px"
  }}
/>
  )}

<h2
  style={{
    color: "#444",
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "8px",
    marginBottom: "4px"
  }}
>
  {invoice.businessName}
</h2>
</div>


  <div>
    <p><strong>Invoice To</strong></p>
    <p>{invoice.clientName}</p>
    <p>{invoice.clientEmail}</p>
  </div>

  <div>
    <p><strong>Invoice Number</strong></p>
    <p>{invoice.invoiceNumber}</p>

    <p><strong>Invoice Date</strong></p>
    <p>{invoice.invoiceDate}</p>

{invoice.projectStartDate && (
  <>
    <p><strong>Project Start Date</strong></p>
    <p>{invoice.projectStartDate}</p>
  </>
)}

{invoice.dueDate && (
  <>
    <p><strong>Due Date</strong></p>
    <p>{invoice.dueDate}</p>
  </>
)}
  </div>
</div>

<h3>Services & Deliverables</h3>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    borderBottom: "2px solid #999",
    paddingBottom: "10px",
    marginBottom: "10px"
  }}
>
  <span>SERVICE</span>
  <span>AMOUNT</span>
</div>

{invoice.lineItems
  .filter(
    (item) =>
      item.description.trim() !== "" ||
      item.amount !== ""
  )
  .map((item, index) => (
      <div
        key={index}
        style={{
          display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: "48px",
          borderBottom: "1px solid #ddd",
          padding: "10px 0"
        }}
      >
        <span>{item.description}</span>
        <span>{invoice.currency} {item.amount || 0}</span>
      </div>
    ))}

  <p style={{ fontSize: "22px", marginTop: "24px", textAlign: "right" }}>
    <strong>Total:</strong> {invoice.currency} {getInvoiceTotal()}
  </p>

  <p><strong>Payment Terms:</strong> {invoice.paymentTerms}</p>
  <p><strong>Notes:</strong> {invoice.notes}</p>
  {invoice.signature && (
  <div
    style={{
      marginTop: "40px",
      textAlign: "right"
    }}
  >
    <img
      src={invoice.signature}
      alt="Signature"
      style={{
        maxWidth: "180px",
        maxHeight: "80px",
        objectFit: "contain"
      }}
    />

    <div
      style={{
        borderTop: "1px solid #999",
        width: "220px",
        marginLeft: "auto",
        marginTop: "8px",
        paddingTop: "6px"
      }}
    >
      Authorized Signature
    </div>
  </div>
)}
</div>


</div>
<button
  type="button"
  onClick={downloadInvoicePdf}
  style={{
    marginTop: "24px",
    padding: "12px 20px",
    cursor: "pointer"
  }}
>
  Download PDF
</button>
<br />
<Link to="/create">Back to Dashboard</Link>
</div>
  );
}

export default CreateInvoice;