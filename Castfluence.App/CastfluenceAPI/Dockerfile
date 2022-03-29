FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build
WORKDIR /src
COPY ["CastfluenceAPI/CastfluenceAPI.csproj", "CastfluenceAPI/"]
RUN dotnet restore "CastfluenceAPI/CastfluenceAPI.csproj"
COPY . .
WORKDIR "/src/CastfluenceAPI"
RUN dotnet build "CastfluenceAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CastfluenceAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CastfluenceAPI.dll"]