export default function OrderItem(props: any) {
  const { item } = props
  return (
    <div className="py-3 border-b-2 flex w-full justify-between h-24 items-center">
      <div className="h-16 w-auto flex">
        <img className="h-16 w-16" src={"https://imgs.search.brave.com/c3Ck1fy-d0ns4cZaYhvVl829spek2OpJXxWJ4r09kRI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcm9k/dWN0LmhzdGF0aWMu/bmV0LzIwMDAwMDMy/NTE1MS9wcm9kdWN0/LzRoajZ4LXRvcC1t/YXUtYW8tcGhvbmct/ZGVwLThfZGM3YmEw/NGI1NWM0NDY5Yzgw/OGU3ZTY5MjM0MTdh/OGYucG5n"} alt={'Image'} />
        <div className="ml-3 flex flex-col justify-between">
          <h4>Áo phông thương hiệu Việt Nam...</h4>
          <p className="text-gray-500">Size: L - Màu sắc: Đen</p>
        </div>
      </div>
      <div>
       <p className="text-gray-500 text-end">Số lượng: {item}</p>
       <p className="text-end">200.000 VNĐ</p>
       <p>Tổng số tiền ({item} sản phẩm): <b>{item*200000} VNĐ</b></p>
      </div>
    </div>
  )
}
// {
//   "code": 0,
//   "message": "string",
//   "result": {
//     "page": 0,
//     "size": 0,
//     "totalPages": 0,
//     "totalItems": 0,
//     "items": [
//       {
//         "id": 0,
//         "orderDate": "2025-07-29",
//         "discountAmount": 0,
//         "totalPrice": 0,
//         "orderStatus": "PENDING",
//         "customerName": "string",
//         "address": {
//           "id": 0,
//           "isDefault": true,
//           "isVisible": true,
//           "status": "ACTIVE",
//           "phone": "string",
//           "streetDetail": "string",
//           "ward": {
//             "code": "string",
//             "name": "string"
//           },
//           "district": {
//             "id": 0,
//             "name": "string"
//           },
//           "province": {
//             "id": 0,
//             "name": "string"
//           }
//         },
//         "orderItems": [
//           {
//             "id": 0,
//             "unitPrice": 0,
//             "quantity": 0,
//             "image": {
//               "id": 0,
//               "imageUrl": "string"
//             },
//             "productVariant": {
//               "id": 0,
//               "color": {
//                 "id": 0,
//                 "name": "string"
//               },
//               "size": {
//                 "id": 0,
//                 "name": "string"
//               },
//               "product": {
//                 "id": 0,
//                 "name": "string"
//               }
//             }
//           }
//         ]
//       }
//     ]
//   }
// }
//   "code": 0,
//   "message": "string",
//   "result": {
//     "page": 0,
//     "size": 0,
//     "totalPages": 0,
//     "totalItems": 0,
//     "items": [
//       {
//         "id": 0,
//         "orderDate": "2025-07-29",
//         "discountAmount": 0,
//         "totalPrice": 0,
//         "orderStatus": "PENDING",
//         "customerName": "string",
//         "address": {
//           "id": 0,
//           "isDefault": true,
//           "isVisible": true,
//           "status": "ACTIVE",
//           "phone": "string",
//           "streetDetail": "string",
//           "ward": {
//             "code": "string",
//             "name": "string"
//           },
//           "district": {
//             "id": 0,
//             "name": "string"
//           },
//           "province": {
//             "id": 0,
//             "name": "string"
//           }
//         },
//         "orderItems": [
//           {
//             "id": 0,
//             "unitPrice": 0,
//             "quantity": 0,
//             "image": {
//               "id": 0,
//               "imageUrl": "string"
//             },
//             "productVariant": {
//               "id": 0,
//               "color": {
//                 "id": 0,
//                 "name": "string"
//               },
//               "size": {
//                 "id": 0,
//                 "name": "string"
//               },
//               "product": {
//                 "id": 0,
//                 "name": "string"
//               }
//             }
//           }
//         ]
//       }
//     ]
//   }
// }