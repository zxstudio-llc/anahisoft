import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CreditCard, Mail } from 'lucide-react';

export default function Expired() {
    return (
        <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4">
            <Head title="Suscripción Expirada" />
            
            <div className="max-w-md w-full">
                <div className="text-center mb-6">
                    <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                    <h1 className="text-2xl font-bold">Suscripción Expirada</h1>
                    <p className="text-muted-foreground">Su suscripción ha expirado o no está activa.</p>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Renueve su suscripción</CardTitle>
                        <CardDescription>
                            Para continuar utilizando todos los servicios, por favor renueve su suscripción.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-md">
                            <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <h3 className="font-medium">Renovar ahora</h3>
                                <p className="text-sm text-muted-foreground">
                                    Renueve su suscripción para seguir utilizando todas las funcionalidades.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-md">
                            <Mail className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <h3 className="font-medium">Contactar soporte</h3>
                                <p className="text-sm text-muted-foreground">
                                    ¿Tiene problemas con su suscripción? Contáctenos para obtener ayuda.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button className="w-full" asChild>
                            <Link href="/subscription">
                                Renovar Suscripción
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="mailto:soporte@ejemplo.com">
                                Contactar Soporte
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
} 