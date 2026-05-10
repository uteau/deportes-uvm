// model Anuncio {
//   id            String      @id @default(uuid())
//   titulo        String
//   contenido     String
//   tipo          AnuncioTipo
//   instagram_url String?
//   is_published  Boolean     @default(true)
//   created_by    String
//   published_at  DateTime?
//   created_at    DateTime    @default(now())
//   updated_at    DateTime    @updatedAt

//   // Relaciones
//   creador Usuario @relation(fields: [created_by], references: [id])

//   @@map("anuncios")
// }



// export class CrearAnuncioDto {
//     titulo
//     contenido

// }