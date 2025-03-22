using DocumentsRegistry.API.Models.Requests;
using DocumentsRegistry.API.Models.Responses;

namespace DocumentsRegistry.API.Repositories;

public interface IDocumentsRepository
{
    Task<Response> AddDocument(DocumentCreateRequest payload);
    Task<IEnumerable<DocumentGridItem>> GetAllDocuments();
    Task<bool> CheckRegistrationCodeIsUnique(string code);
    Task<bool> CheckFileNameIsUnique(string fileName);
}
